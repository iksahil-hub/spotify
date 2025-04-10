
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

## 📄 License
This project is licensed under the MIT License.
