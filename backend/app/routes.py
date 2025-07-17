from flask import Blueprint, request, jsonify, render_template, redirect, url_for
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from werkzeug.utils import secure_filename
from app import db, socketio
from app.models import User, Song, Playlist, PlaylistSong, Tag
import os
import random
import requests

main = Blueprint("main", __name__)

UPLOAD_FOLDER = "app/static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

YOUTUBE_API_KEY = "AIzaSyAxoKdULhXnoOgC7QfLpnICULdpaiyB98I"

user_playback_queues = {}
user_recently_played = {}
user_favorites = {}

# --------- AUTH ROUTES --------- #

@main.route('/')
def home():
    songs = Song.query.all()
    return render_template('home.html', songs=songs)

@main.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username, email, password = data.get('username'), data.get('email'), data.get('password')
    if not all([username, email, password]):
        return jsonify({"error": "All fields are required"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400
    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email, password = data.get('email'), data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401
    token = create_access_token(identity=str(user.id))
    return jsonify({"message": "Login successful", "access_token": token}), 200


# --------- SONG ROUTES --------- #

@main.route('/songs', methods=['GET'])
def get_songs():
    songs = Song.query.all()
    return jsonify([{
        'id': s.id, 'title': s.title, 'artist': s.artist,
        'album': s.album, 'duration': s.duration,
        'youtube_url': s.youtube_url, 'is_public': s.is_public
    } for s in songs])

@main.route('/songs/<int:song_id>', methods=['GET'])
def get_song(song_id):
    s = Song.query.get(song_id)
    if not s:
        return jsonify({'error': 'Song not found'}), 404
    return jsonify({
        'id': s.id, 'title': s.title, 'artist': s.artist,
        'album': s.album, 'duration': s.duration, 'youtube_url': s.youtube_url
    })

@main.route('/songs', methods=['POST'])
@jwt_required()
def add_song():
    data = request.get_json()
    title, artist, album = data.get('title', '').strip(), data.get('artist', '').strip(), data.get('album', '').strip()
    youtube_url, duration = data.get('youtube_url'), data.get('duration', '').strip()
    tag_names = data.get('tags', [])
    
    if not all([title, artist, album, youtube_url]):
        return jsonify({"error": "All fields are required"}), 400

    song = Song(title=title, artist=artist, album=album, duration=duration, youtube_url=youtube_url)
    db.session.add(song)
    db.session.flush()

    for name in tag_names:
        tag = Tag.query.filter_by(name=name.strip()).first()
        if not tag:
            tag = Tag(name=name.strip())
            db.session.add(tag)
            db.session.flush()
        song.tags.append(tag)

    db.session.commit()
    return jsonify({"message": "Song added successfully", "song_id": song.id}), 201

@main.route('/songs/tag/<string:tag_name>')
def songs_by_tag(tag_name):
    tag = Tag.query.filter_by(name=tag_name).first_or_404()
    return render_template("songs.html", songs=tag.songs, tag=tag_name)

@main.route('/songs/search')
def search_songs():
    q = request.args.get("q", "").strip()
    if not q:
        return redirect(url_for("main.list_songs"))
    songs = Song.query.filter(Song.title.ilike(f"%{q}%") |
                              Song.artist.ilike(f"%{q}%") |
                              Song.album.ilike(f"%{q}%")).all()
    return render_template("songs.html", songs=songs, query=q)

@main.route('/songs/page')
def list_songs():
    songs = Song.query.filter(Song.youtube_url.isnot(None)).all()
    return render_template("songs.html", songs=songs)

@main.route('/play/<int:song_id>')
def play_song(song_id):
    song = Song.query.get(song_id)
    if not song or not song.youtube_url:
        return "❌ Song not found or no YouTube URL.", 404
    return render_template("play.html", song=song)


# --------- PLAYLIST ROUTES --------- #

@main.route('/playlists', methods=['POST'])
@jwt_required()
def create_playlist():
    name = request.get_json().get('name')
    if not name:
        return jsonify({'error': 'Playlist name is required'}), 400
    playlist = Playlist(name=name, user_id=get_jwt_identity())
    db.session.add(playlist)
    db.session.commit()
    return jsonify({'message': 'Playlist created', 'playlist_id': playlist.id}), 201

@main.route('/playlists', methods=['GET'])
@jwt_required()
def get_user_playlists():
    playlists = Playlist.query.filter_by(user_id=get_jwt_identity()).all()
    return jsonify([{
        'id': p.id, 'name': p.name, 'created_at': p.created_at
    } for p in playlists])

@main.route('/playlists/<int:playlist_id>/songs', methods=['POST'])
@jwt_required()
def add_song_to_playlist(playlist_id):
    song_id = request.get_json().get('song_id')
    playlist = Playlist.query.get_or_404(playlist_id)
    if playlist.user_id != get_jwt_identity():
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.add(PlaylistSong(playlist_id=playlist.id, song_id=song_id))
    db.session.commit()
    return jsonify({'message': 'Song added to playlist'}), 200

@main.route('/playlists/<int:playlist_id>/songs', methods=['GET'])
def get_playlist_songs(playlist_id):
    playlist = Playlist.query.get_or_404(playlist_id)
    return jsonify([{
        'id': ps.song.id, 'title': ps.song.title, 'artist': ps.song.artist,
        'album': ps.song.album, 'duration': ps.song.duration
    } for ps in playlist.songs])

@main.route('/playlists/<int:playlist_id>/shuffle')
def shuffle_playlist(playlist_id):
    playlist = Playlist.query.get_or_404(playlist_id)
    songs = list(playlist.songs)
    random.shuffle(songs)
    return render_template("songs.html", songs=[ps.song for ps in songs], playlist=playlist)


# --------- QUEUE / RECENT / FAVORITES --------- #

@main.route('/queue/add/<int:song_id>')
@jwt_required()
def add_to_queue(song_id):
    user_id = str(get_jwt_identity())
    user_playback_queues.setdefault(user_id, []).append(song_id)
    return jsonify({"message": "Added to queue", "queue": user_playback_queues[user_id]})

@main.route('/queue/remove/<int:song_id>')
@jwt_required()
def remove_from_queue(song_id):
    user_id = str(get_jwt_identity())
    if song_id in user_playback_queues.get(user_id, []):
        user_playback_queues[user_id].remove(song_id)
        return jsonify({"message": "Removed from queue"}), 200
    return jsonify({"error": "Song not in queue"}), 404

@main.route('/queue/next')
@jwt_required()
def next_in_queue():
    user_id = str(get_jwt_identity())
    queue = user_playback_queues.get(user_id, [])
    if not queue:
        return jsonify({"message": "Queue is empty."})
    song_id = queue.pop(0)
    song = Song.query.get(song_id)
    user_recently_played.setdefault(user_id, []).append(song_id)
    return render_template("play.html", song=song)

@main.route('/recent', methods=['GET'])
@jwt_required()
def recent_songs():
    user_id = str(get_jwt_identity())
    song_ids = user_recently_played.get(user_id, [])[-10:]
    songs = Song.query.filter(Song.id.in_(song_ids)).all()
    return jsonify([{'id': s.id, 'title': s.title} for s in songs])

@main.route('/favorites/add/<int:song_id>')
@jwt_required()
def add_favorite(song_id):
    user_id = str(get_jwt_identity())
    user_favorites.setdefault(user_id, set()).add(song_id)
    return jsonify({"message": "Added to favorites"})

@main.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = str(get_jwt_identity())
    song_ids = list(user_favorites.get(user_id, []))
    songs = Song.query.filter(Song.id.in_(song_ids)).all()
    return jsonify([{'id': s.id, 'title': s.title} for s in songs])


# --------- EXTRA FEATURES --------- #

@main.route('/lyrics/<int:song_id>')
def get_lyrics(song_id):
    song = Song.query.get(song_id)
    if not song:
        return jsonify({"error": "Song not found"}), 404
    return jsonify({
        "title": song.title,
        "lyrics": f"Lyrics for {song.title} by {song.artist} coming soon."
    })

@main.route('/youtube/search')
def youtube_search_stub():
    query = request.args.get("q")
    return jsonify({"message": f"Simulated YouTube search for '{query}'"})

@main.route('/youtube/real_search')
def real_youtube_search():
    query = request.args.get("q")
    if not query:
        return jsonify({"error": "Missing query"}), 400
    url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q={query}&key={YOUTUBE_API_KEY}"
    response = requests.get(url)
    if response.status_code != 200:
        return jsonify({"error": "YouTube API error"}), 500
    return jsonify(response.json())

@main.route('/songs/bulk_upload', methods=['POST'])
def bulk_upload_songs():
    try:
        data = request.get_json()
        for s in data:
            song = Song(title=s["title"], artist=s["artist"], album=s["album"],
                        duration=s["duration"], youtube_url=s.get("youtube_url"))
            db.session.add(song)
        db.session.commit()
        return jsonify({"message": "Bulk upload successful!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@main.route('/songs/upload', methods=['POST'])
@jwt_required()
def upload_song():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["file"]
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    data = request.form
    title = data.get("title")
    artist = data.get("artist")
    album = data.get("album")
    duration = data.get("duration")

    song = Song(title=title, artist=artist, album=album, duration=duration, youtube_url=file_path)
    db.session.add(song)
    db.session.commit()

    return jsonify({"message": "Song uploaded successfully", "path": file_path})
