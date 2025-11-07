from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Post, Review
from datetime import timedelta, datetime

app = Flask(__name__)
CORS(app)

# =====================================
# 🔧 CONFIGURACIÓN GENERAL
# =====================================
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'supersecretkey'  # Cambiar en producción
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

db.init_app(app)
jwt = JWTManager(app)

# Crear tablas al iniciar
with app.app_context():
    db.create_all()


# =====================================
# 🏠 RUTA PRINCIPAL
# =====================================
@app.route('/')
def home():
    return jsonify({"message": "API Flask funcionando correctamente"})


# =====================================
# 👤 REGISTRO
# =====================================
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user')

    if not all([name, email, password]):
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "El usuario ya existe"}), 400

    hashed = generate_password_hash(password)
    new_user = User(name=name, email=email, password=hashed, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario registrado correctamente"}), 201


# =====================================
# 🔑 LOGIN
# =====================================
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    access_token = create_access_token(identity={
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    })
    return jsonify(access_token=access_token), 200


# =====================================
# 📝 CRUD POSTS
# =====================================
@app.route('/posts', methods=['GET'])
@jwt_required()
def get_posts():
    posts = Post.query.all()
    return jsonify([
        {
            "id": p.id,
            "title": p.title,
            "content": p.content,
            "author": p.author,
            "date": p.date.strftime("%d/%m/%Y %H:%M") if p.date else ""
        }
        for p in posts
    ])


@app.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    try:
        user = get_jwt_identity()
        data = request.get_json()

        title = data.get('title')
        content = data.get('content')
        author = user["name"] if user else data.get('author', 'Anónimo')
        date_str = data.get("date")

        if not title or not content:
            return jsonify({"msg": "Faltan campos requeridos"}), 422

        # Convertir fecha
        if date_str:
            try:
                date_obj = datetime.strptime(date_str, "%d/%m/%Y, %H:%M:%S")
            except Exception:
                date_obj = datetime.now()
        else:
            date_obj = datetime.now()

        new_post = Post(title=title, content=content, author=author, date=date_obj)
        db.session.add(new_post)
        db.session.commit()

        return jsonify({"msg": "Post guardado correctamente"}), 201

    except Exception as e:
        print("❌ Error en /posts:", e)
        return jsonify({"msg": "Error interno del servidor"}), 500


@app.route('/posts/<int:id>', methods=['PUT'])
@jwt_required()
def update_post(id):
    data = request.get_json()
    post = Post.query.get(id)
    if not post:
        return jsonify({"msg": "Post no encontrado"}), 404

    post.title = data.get('title', post.title)
    post.content = data.get('content', post.content)
    db.session.commit()
    return jsonify({"msg": "Post actualizado"}), 200


@app.route('/posts/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_post(id):
    post = Post.query.get(id)
    if not post:
        return jsonify({"msg": "Post no encontrado"}), 404
    db.session.delete(post)
    db.session.commit()
    return jsonify({"msg": "Post eliminado"}), 200


# =====================================
# 💬 CRUD REVIEWS
# =====================================
@app.route('/reviews', methods=['GET'])
@jwt_required()
def get_reviews():
    reviews = Review.query.all()
    return jsonify([
        {
            "id": r.id,
            "content": r.content,
            "author": r.author,
            "date": r.date.strftime("%d/%m/%Y %H:%M") if r.date else "",
            "post_id": r.post_id,
        }
        for r in reviews
    ])


@app.route('/reviews', methods=['POST'])
@jwt_required()
def create_review():
    try:
        user = get_jwt_identity()
        data = request.get_json()

        content = data.get("content")
        author = user["name"] if user else data.get("author", "Anónimo")
        post_id = data.get("post_id")
        date_str = data.get("date")

        if not content:
            return jsonify({"msg": "Falta contenido"}), 422

        # Convertir fecha
        if date_str:
            try:
                date_obj = datetime.strptime(date_str, "%d/%m/%Y, %H:%M:%S")
            except Exception:
                date_obj = datetime.now()
        else:
            date_obj = datetime.now()

        new_review = Review(content=content, author=author, date=date_obj, post_id=post_id)
        db.session.add(new_review)
        db.session.commit()

        return jsonify({"msg": "Review guardada correctamente"}), 201

    except Exception as e:
        print("❌ Error en /reviews:", e)
        return jsonify({"msg": "Error interno del servidor"}), 500


@app.route('/reviews/<int:id>', methods=['PUT'])
@jwt_required()
def update_review(id):
    data = request.get_json()
    review = Review.query.get(id)
    if not review:
        return jsonify({"msg": "Review no encontrada"}), 404
    review.content = data.get('content', review.content)
    db.session.commit()
    return jsonify({"msg": "Review actualizada"}), 200


@app.route('/reviews/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_review(id):
    review = Review.query.get(id)
    if not review:
        return jsonify({"msg": "Review no encontrada"}), 404
    db.session.delete(review)
    db.session.commit()
    return jsonify({"msg": "Review eliminada"}), 200


# =====================================
# 🚀 MAIN
# =====================================
if __name__ == '__main__':
    app.run(debug=True, port=5000)
