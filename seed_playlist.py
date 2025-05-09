# seed_playlist.py
from app import create_app, db
from app.models import Playlist, Song, User, PlaylistSong

# Initialize your app and push context
app = create_app()
app.app_context().push()

def seed_playlist():
    # 1) Pick an existing user
    user = db.session.query(User).first()
    if not user:
        print("❌ No users found. Please create at least one user first.")
        return
    print(f"Using User(ID={user.id}, email={user.email})")

    # 2) Fetch or create the playlist
    playlist_name = "My Seeded Playlist"
    playlist = (
        db.session.query(Playlist)
        .filter_by(name=playlist_name, user_id=user.id)
        .first()
    )
    if not playlist:
        playlist = Playlist(name=playlist_name, user_id=user.id)
        db.session.add(playlist)
        db.session.commit()
        print(f"✅ Created Playlist(ID={playlist.id})")
    else:
        print(f"ℹ️  Found Playlist(ID={playlist.id})")

    # 3) List of song IDs to seed (customize these)
    song_ids = [1, 2, 3]

    # 4) For each song ID, create a PlaylistSong record if missing
    for sid in song_ids:
        song = db.session.get(Song, sid)
        if not song:
            print(f"⚠️  Song(ID={sid}) not found—skipping.")
            continue

        # Check existing mapping
        exists = (
            db.session.query(PlaylistSong)
            .filter_by(playlist_id=playlist.id, song_id=sid)
            .first()
        )

        if not exists:
            link = PlaylistSong(playlist_id=playlist.id, song_id=sid)
            db.session.add(link)
            print(f"    ➕ Linked Song(ID={sid}) → Playlist(ID={playlist.id})")
        else:
            print(f"    ➖ Song(ID={sid}) already linked—skipping.")

    # 5) Commit all changes
    db.session.commit()
    print("🎉 Seeding complete.")

if __name__ == "__main__":
    seed_playlist()
