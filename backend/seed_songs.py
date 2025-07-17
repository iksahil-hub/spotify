from app import create_app, db 
from app.models import Song

app = create_app()

# Extended song data with more categories
songs_by_category = {
    "Bollywood": [
       ("Tum Hi Ho", "Arijit Singh", "Aashiqui 2", 258),
    ("Channa Mereya", "Arijit Singh", "Ae Dil Hai Mushkil", 274),
    ("Tera Ban Jaunga", "Akhil & Tulsi Kumar", "Kabir Singh", 224),
    ("Kal Ho Naa Ho", "Sonu Nigam", "Kal Ho Naa Ho", 297),
    ("Tujh Mein Rab Dikhta Hai", "Roop Kumar Rathod", "Rab Ne Bana Di Jodi", 276),
    ("Raabta", "Arijit Singh", "Agent Vinod", 250),
    ("Tum Se Hi", "Mohit Chauhan", "Jab We Met", 280),
    ("Ae Dil Hai Mushkil", "Arijit Singh", "Ae Dil Hai Mushkil", 281),
    ("Jeene Laga Hoon", "Atif Aslam", "Ramaiya Vastavaiya", 235),
    ("Galliyan", "Ankit Tiwari", "Ek Villain", 250),
    ("Muskurane", "Arijit Singh", "CityLights", 275),
    ("Agar Tum Saath Ho", "Alka Yagnik & Arijit Singh", "Tamasha", 320),
    ("Sun Saathiya", "Priya Saraiya & Divya Kumar", "ABCD 2", 200),
    ("Pee Loon", "Mohit Chauhan", "Once Upon a Time in Mumbaai", 260),
    ("Tum Mile", "Neeraj Shridhar", "Tum Mile", 245),
    ("Bolna", "Arijit Singh & Asees Kaur", "Kapoor & Sons", 240),
    ("Tera Yaar Hoon Main", "Arijit Singh", "Sonu Ke Titu Ki Sweety", 280),
    ("Janam Janam", "Arijit Singh", "Dilwale", 268),
    ("Kaise Hua", "Vishal Mishra", "Kabir Singh", 222),
    ("Khairiyat", "Arijit Singh", "Chhichhore", 260),
    ("Tujhe Kitna Chahne Lage", "Arijit Singh", "Kabir Singh", 270),
    ("Humdard", "Arijit Singh", "Ek Villain", 258),
    ("Main Phir Bhi Tumko Chahunga", "Arijit Singh", "Half Girlfriend", 265),
    ("Hasi Ban Gaye", "Ami Mishra", "Hamari Adhuri Kahani", 233),
    ("Dil Diyan Gallan", "Atif Aslam", "Tiger Zinda Hai", 250)
    ],
    "Hollywood": [
        # (already added above)
    ],
    "Party": [
        ("Uptown Funk", "Mark Ronson ft. Bruno Mars", "Uptown Special", 270),
        ("Party Rock Anthem", "LMFAO", "Sorry for Party Rocking", 262),
        ("I Gotta Feeling", "Black Eyed Peas", "The E.N.D.", 285),
        ("Don't Start Now", "Dua Lipa", "Future Nostalgia", 183),
        ("Taki Taki", "DJ Snake", "Carte Blanche", 213),
        ("Turn Down for What", "DJ Snake & Lil Jon", "Single", 213),
        ("Lean On", "Major Lazer", "Peace Is The Mission", 176),
        ("Starboy", "The Weeknd", "Starboy", 230),
        ("Sicko Mode", "Travis Scott", "Astroworld", 312),
        ("Mi Gente", "J Balvin", "Vibras", 189),
        ("Despacito", "Luis Fonsi", "Vida", 229),
        ("24K Magic", "Bruno Mars", "24K Magic", 215),
        ("Yeah!", "Usher", "Confessions", 250),
        ("Levels", "Avicii", "Levels", 221),
        ("Blame", "Calvin Harris", "Motion", 238),
        ("Sugar", "Maroon 5", "V", 235),
        ("We Found Love", "Rihanna", "Talk That Talk", 211),
        ("In The Name Of Love", "Martin Garrix", "Single", 203),
        ("Break Free", "Ariana Grande", "My Everything", 211),
        ("Dance Again", "Jennifer Lopez", "Dance Again", 225),
        ("Where Them Girls At", "David Guetta", "Nothing but the Beat", 211),
        ("Firework", "Katy Perry", "Teenage Dream", 228),
        ("Waka Waka", "Shakira", "Listen Up!", 212),
        ("On The Floor", "Jennifer Lopez", "Love?", 229),
        ("Cheap Thrills", "Sia", "This Is Acting", 212),
    ],
    "Sad": [
        ("Let Her Go", "Passenger", "All the Little Lights", 252),
        ("Fix You", "Coldplay", "X&Y", 295),
        ("When I Was Your Man", "Bruno Mars", "Unorthodox Jukebox", 225),
        ("Say Something", "A Great Big World", "Is There Anybody Out There?", 234),
        ("Someone Like You", "Adele", "21", 285),
        ("All I Want", "Kodaline", "In a Perfect World", 285),
        ("Lose You To Love Me", "Selena Gomez", "Rare", 205),
        ("Jealous", "Labrinth", "Jealous", 260),
        ("Let Me Down Slowly", "Alec Benjamin", "Narrated for You", 162),
        ("Creep", "Radiohead", "Pablo Honey", 238),
        ("I’ll Never Love Again", "Lady Gaga", "A Star Is Born", 273),
        ("Hurt", "Christina Aguilera", "Back to Basics", 246),
        ("Too Good at Goodbyes", "Sam Smith", "The Thrill of It All", 213),
        ("Bleeding Love", "Leona Lewis", "Spirit", 263),
        ("Back to December", "Taylor Swift", "Speak Now", 267),
        ("Skinny Love", "Birdy", "Birdy", 234),
        ("Tears in Heaven", "Eric Clapton", "Rush", 269),
        ("I Will Always Love You", "Whitney Houston", "The Bodyguard", 273),
        ("Un-break My Heart", "Toni Braxton", "Secrets", 285),
        ("Let It Go", "James Bay", "Chaos and the Calm", 255),
        ("If I Die Young", "The Band Perry", "The Band Perry", 213),
        ("Say You Love Me", "Jessie Ware", "Tough Love", 256),
        ("All I Want", "Olivia Rodrigo", "High School Musical", 231),
        ("Breathe Me", "Sia", "Colour the Small One", 270),
        ("My Immortal", "Evanescence", "Fallen", 260),
    ],
    "Romantic": [
        ("Perfect", "Ed Sheeran", "Divide", 263),
        ("A Thousand Years", "Christina Perri", "Lovestrong", 267),
        ("Just The Way You Are", "Bruno Mars", "Doo-Wops & Hooligans", 220),
        ("Thinking Out Loud", "Ed Sheeran", "X", 281),
        ("You Are The Reason", "Calum Scott", "Only Human", 210),
        ("All of Me", "John Legend", "Love in the Future", 269),
        ("Love Story", "Taylor Swift", "Fearless", 235),
        ("I Won’t Give Up", "Jason Mraz", "Love Is a Four Letter Word", 270),
        ("Marry Me", "Train", "Save Me, San Francisco", 230),
        ("Your Song", "Elton John", "Elton John", 240),
        ("Truly Madly Deeply", "Savage Garden", "Savage Garden", 250),
        ("Can’t Help Falling in Love", "Elvis Presley", "Blue Hawaii", 179),
        ("Lucky", "Jason Mraz", "We Sing. We Dance. We Steal Things.", 205),
        ("She Will Be Loved", "Maroon 5", "Songs About Jane", 256),
        ("I Don’t Want to Miss a Thing", "Aerosmith", "Armageddon", 273),
        ("Everything", "Michael Bublé", "Call Me Irresponsible", 215),
        ("Just a Kiss", "Lady A", "Own the Night", 240),
        ("Because You Loved Me", "Celine Dion", "Falling into You", 260),
        ("No One", "Alicia Keys", "As I Am", 270),
        ("Kiss Me", "Sixpence None the Richer", "Sixpence", 221),
        ("Bleeding Love", "Leona Lewis", "Spirit", 263),
        ("Make You Feel My Love", "Adele", "19", 230),
        ("I’m Yours", "Jason Mraz", "We Sing. We Dance.", 240),
        ("Fallin'", "Alicia Keys", "Songs in A Minor", 212),
        ("Halo", "Beyoncé", "I Am... Sasha Fierce", 261),
    ]
}

with app.app_context():
    for category, songs in songs_by_category.items():
        print(f"Adding {len(songs)} songs to category: {category}")
        for title, artist, album, duration in songs:
            if not Song.query.filter_by(title=title, artist=artist).first():
                s = Song(title=title, artist=artist, album=album, duration=duration)
                db.session.add(s)
    db.session.commit()
    print("✅ All categorized songs added successfully!")
