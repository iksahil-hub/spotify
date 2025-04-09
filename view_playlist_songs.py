from app import create_app, db
from app.models import Playlist, PlaylistSong, Song

# Initialize app context
app = create_app()
app.app_context().push()

# Specify the playlist ID you want to check
playlist_id = 4  # Change as needed

# Fetch the playlist
playlist = Playlist.query.get(playlist_id)

if not playlist:
    print(f"❌ Playlist with ID {playlist_id} not found.")
else:
    print(f"\n🎧 Songs in Playlist: '{playlist.name}' (ID: {playlist.id})\n")
    for link in playlist.songs:
        song = link.song
        print(f"• {song.id}. {song.title} by {song.artist} [{song.album}] - {song.duration}s")
