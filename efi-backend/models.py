from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# ==========================
# 👤 USUARIOS
# ==========================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), default='user')

    def __repr__(self):
        return f"<User {self.email}>"


# ==========================
# 📝 POSTS
# ==========================
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime, default=datetime.now)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "author": self.author,
            "date": self.date.strftime("%d/%m/%Y %H:%M") if self.date else ""
        }


# ==========================
# 💬 REVIEWS
# ==========================
class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime, default=datetime.now)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "author": self.author,
            "date": self.date.strftime("%d/%m/%Y %H:%M") if self.date else "",
            "post_id": self.post_id
        }
