import os
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
socketio = SocketIO(cors_allowed_origins="*")  # Optional: add async_mode if needed

def create_app():
    app = Flask(__name__)

    # Enable CORS
    CORS(app)

    # Configuration
    base_dir = os.path.abspath(os.path.dirname(__file__))
    instance_db_path = os.path.join(base_dir, '..', 'instance', 'database.db')
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", f"sqlite:///{instance_db_path}")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your-secret-key")

    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    socketio.init_app(app)

    # Import models after initializing db
    from app.models import User, Song, Playlist, PlaylistSong

    # Register blueprints/routes
    from app.routes import main
    app.register_blueprint(main)

    return app

# Export for external access
__all__ = ['db', 'socketio']
