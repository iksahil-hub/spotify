from flask_cors import CORS
from app import create_app, socketio

app = create_app()

if __name__ == "__main__":
    socketio.run(app, debug=True)

app = create_app()



if __name__ == "__main__":

    socketio.run(app, debug=True)
