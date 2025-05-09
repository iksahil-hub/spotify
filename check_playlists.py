# check_playlists.py
import sqlite3
import os

# Make sure this matches your app’s SQLALCHEMY_DATABASE_URI
DB_PATH = os.path.join(os.path.dirname(__file__), "instance", "db.sqlite3")

print("Opening database at:", DB_PATH)
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# list all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row[0] for row in cursor.fetchall()]
print("Tables:", tables)

# query the correct table name: 'playlist'
if "playlist" in tables:
    cursor.execute("SELECT * FROM playlist;")
    rows = cursor.fetchall()
    print("\nPlaylist rows (id, name, ...):")
    for row in rows:
        print(row)
else:
    print("❌ No 'playlist' table found!")

conn.close()
