
---

## 🧑‍🎨 Frontend Team Instructions (React)

### 🔗 Base Setup
- Use **Axios** to make authenticated requests (JWT token in headers).
- Store JWT token in localStorage after login/signup.

### 🔑 Auth
- POST `/signup` → user signup
- POST `/login` → user login (returns JWT)

### 🎵 Songs
- GET `/songs` → fetch all songs
- POST `/songs` → add a new song (send `title`, `artist`, `youtube_url`, `tags` etc.)
- GET `/songs/tag/<tag_name>` → filter by category/tag
- GET `/songs/search?q=<query>` → search songs
- GET `/songs/<int:song_id>` → get single song
- POST `/songs/<int:song_id>/like` → like a song
- POST `/songs/<int:song_id>/queue` → add to playback queue

### 📁 Playlists
- POST `/playlists` → create playlist
- GET `/playlists/<int:playlist_id>` → view playlist
- POST `/playlists/<int:playlist_id>/songs` → add song to playlist
- DELETE `/playlists/<int:playlist_id>/songs/<int:song_id>` → remove from playlist

### 🔁 Playback
- GET `/queue` → view user's current queue
- DELETE `/queue/<int:song_id>` → remove from queue
- GET `/recent` → recently played songs

---

## 🔮 Upcoming Enhancements
- Real-time playback sync via **Socket.IO**
- **YouTube API** integration for real search and play
- Admin dashboard for managing users and songs
- User profile management
- Audio file upload support

---

## 🤝 Collaboration

> Backend: Tushar Chauhan  
> Frontend: React Team (to be connected via the API endpoints above)

---

## 📌 Deployment (Planned)
- Backend to be deployed via **Render/Heroku**
- Frontend (React) via **Vercel/Netlify**

---
# 🎧 Spotify Clone Backend

This is the backend for a Spotify-inspired music streaming app built using **Flask**, designed to integrate smoothly with a **React frontend**. The backend supports features such as user authentication, playlists, YouTube-powered playback, favorites, tagging, recently played history, and more.

---

## 🚀 Features

- User Authentication (Signup/Login with JWT)
- Song CRUD operations
- Playlist creation and management
- YouTube video integration for playback
- Favorites / Liked Songs
- Playback queue per user
- Tag-based filtering (e.g., Bollywood, Party, Sad)
- Search & shuffle functionality
- Recently played songs
- Admin and future upgrade-ready

---

## 🧩 Technologies Used

- **Flask**
- **Flask-JWT-Extended**
- **SQLAlchemy + SQLite**
- **Flask-Migrate**
- **React (frontend integration)**
- **YouTube Embeds (for playback)**
- **Postman (for testing routes)**

---

## 🔗 Backend-to-Frontend Route Mapping

### 🧑‍💻 Authentication Routes

| Method | Route | Description | Frontend Usage |
|--------|-------|-------------|----------------|
| `POST` | `/signup` | Register new user | Signup form |
| `POST` | `/login` | Login + return JWT | Login form, store token |

---

### 🎵 Song Routes

| Method | Route | Description | Frontend Usage |
|--------|-------|-------------|----------------|
| `GET` | `/songs` | Get all songs | Home page / All Songs |
| `POST` | `/songs` | Add new song | Admin panel |
| `GET` | `/songs/search?q=query` | Search songs | Search bar |
| `GET` | `/songs/filter?tag=Bollywood` | Filter by tag | Categories (Bollywood, Party, etc.) |
| `GET` | `/songs/shuffle` | Get shuffled songs | Shuffle play |
| `POST` | `/songs/<id>/like` | Like/unlike a song | Heart/Favorite toggle |
| `GET` | `/songs/favorites` | Get liked songs | Favorites page |
| `GET` | `/songs/queue` | Get current queue | Playback queue |
| `POST` | `/songs/queue` | Add to queue | Add to queue button |
| `DELETE` | `/songs/queue/<id>` | Remove from queue | Queue management |
| `POST` | `/songs/<id>/played` | Mark as played | Update history |
| `GET` | `/songs/recent` | Get recently played | History view |

---

### 📁 Playlist Routes

| Method | Route | Description | Frontend Usage |
|--------|-------|-------------|----------------|
| `POST` | `/playlists` | Create a playlist | Playlist creation form |
| `GET` | `/playlists` | Get all playlists | Playlist list |
| `GET` | `/playlists/<id>` | Get one playlist | Playlist detail page |
| `POST` | `/playlists/<id>/songs` | Add song to playlist | Add to playlist from song page |
| `DELETE` | `/playlists/<id>/songs/<song_id>` | Remove song from playlist | Edit playlist |

---

### 👤 User Profile (Optional)

| Method | Route | Description | Frontend Usage |
|--------|-------|-------------|----------------|
| `GET` | `/profile` | Get user profile | Profile page |
| `PUT` | `/profile/update` | Update profile | Edit profile info |

---

## 📝 Notes

✅ **Manager Requirement:**  
The backend routes are structured in a way that makes frontend development with React easier and more predictable. Route names and JSON responses are kept clean and REST-friendly to simplify integration.

---

## 📂 Directory Structure


## 📄 License
This project is licensed under the MIT License.
