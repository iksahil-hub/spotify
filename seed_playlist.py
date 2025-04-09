from app import create_app, db
from app.models import Song, Playlist, PlaylistSong

app = create_app()

with app.app_context():
    playlist_id = 4  # Use your actual playlist ID here

    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        print(f"Playlist with ID {playlist_id} not found.")
    else:
        print(f"📻 Adding songs to playlist: '{playlist.name}'")

        all_songs = Song.query.all()
        added = 0

        for song in all_songs:
            already_added = PlaylistSong.query.filter_by(song_id=song.id, playlist_id=playlist_id).first()
            if not already_added:
                db.session.add(PlaylistSong(song_id=song.id, playlist_id=playlist_id))
                added += 1

        db.session.commit()
        print(f"✅ Added {added} new songs to playlist '{playlist.name}' (ID: {playlist.id})")
