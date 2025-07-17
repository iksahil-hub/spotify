# inspect_db.py
from app import create_app, db
from app.models import User, Song, Playlist

app = create_app()
with app.app_context():
    print(f"👥 Total users: {User.query.count()}")
    print(f"🎵 Total songs: {Song.query.count()}")
    print(f"📃 Total playlists: {Playlist.query.count()}")

    print("\n🧑 Users:")
    for user in User.query.limit(5).all():
        print(f" - {user.id}: {user.username} ({user.email})")

    print("\n🎶 Songs:")
    for song in Song.query.limit(5).all():
        print(f" - {song.id}: {song.title} by {song.artist}")

    print("\n📂 Playlists:")
    for playlist in Playlist.query.limit(5).all():
<<<<<<< HEAD
        print(f" - {playlist.id}: {playlist.name} (User ID: {playlist.user_id})")
=======
        print(f" - {playlist.id}: {playlist.name} (User ID: {playlist.user_id})")
>>>>>>> 725f07b (Initial commit or your custom message)
