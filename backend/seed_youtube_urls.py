from app import create_app, db
from app.models import Song
from googleapiclient.discovery import build
import os
import time

# 🔧 Ensure instance folder exists and correct relative path
basedir = os.path.abspath(os.path.dirname(__file__))
instance_path = os.path.join(basedir, 'instance')
os.makedirs(instance_path, exist_ok=True)

# 🔧 Load the app with correct instance path
app = create_app()

# 🔐 YouTube API Setup
YOUTUBE_API_KEY = 'AIzaSyAxoKdULhXnoOgC7QfLpnICULdpaiyB98I'
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

def fetch_youtube_url(song_title, artist):
    query = f"{song_title} {artist} official audio"
    try:
        response = youtube.search().list(
            q=query,
            part="snippet",
            type="video",
            maxResults=1
        ).execute()

        video_id = response['items'][0]['id']['videoId']
        return f"https://www.youtube.com/watch?v={video_id}"
    except Exception as e:
        print(f"❌ Error for {song_title} by {artist}: {e}")
        return None

with app.app_context():
    songs = Song.query.all()
    for song in songs:
        if not song.youtube_url:
            print(f"🔎 Fetching for: {song.title} by {song.artist}")
            youtube_url = fetch_youtube_url(song.title, song.artist)
            if youtube_url:
                song.youtube_url = youtube_url
                print(f"✅ Updated: {song.title} -> {youtube_url}")
            time.sleep(1)

    db.session.commit()
    print("🎉 All available YouTube URLs updated.")
