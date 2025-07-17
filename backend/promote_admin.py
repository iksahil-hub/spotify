# promote_admin.py
from app import create_app, db
from app.models import User

app = create_app()
with app.app_context():
    email = "chauhan@gmail.com"  # Change as needed
    user = User.query.filter_by(email=email).first()
    if user:
        user.is_admin = True
        db.session.commit()
        print(f"{user.username} promoted to admin.")
    else:
        print("User not found.")
