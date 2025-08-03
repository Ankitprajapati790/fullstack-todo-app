from flask import Blueprint, request, jsonify, redirect, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt, os, requests
from extensions import db
from models import User
import re

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


# -------------------------------
# ✅ Register route (POST /auth/register)
# -------------------------------
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'error': 'Invalid email format'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'User already exists'}), 409

    try:
        hashed = generate_password_hash(password)
        user = User(email=email, password=hashed)
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error: ' + str(e)}), 500


# -------------------------------
# ✅ Login route (POST /auth/login)
# -------------------------------
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not check_password_hash(user.password, password):
        return jsonify({'error': 'Incorrect password'}), 401

    token = jwt.encode(
        {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=12)
        },
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    return jsonify({'token': token}), 200


# -------------------------------
# ✅ Google login route (GET /auth/google-login)
# -------------------------------
@auth_bp.route('/google-login')
def google_login():
    redirect_uri = "http://localhost:5000/auth/google-callback"
    return redirect(
        f"https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={os.getenv('GOOGLE_CLIENT_ID')}"
        f"&redirect_uri={redirect_uri}"
        f"&response_type=code"
        f"&scope=email profile"
        f"&access_type=offline"
    )


# -------------------------------
# ✅ Google OAuth callback (GET /auth/google-callback)
# -------------------------------
@auth_bp.route('/google-callback')
def google_callback():
    code = request.args.get("code")
    redirect_uri = "http://localhost:5000/auth/google-callback"

    token_res = requests.post("https://oauth2.googleapis.com/token", data={
        "code": code,
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    })

    if not token_res.ok:
        return jsonify({"error": "Failed to retrieve token from Google"}), 400

    token_data = token_res.json()
    access_token = token_data.get("access_token")
    if not access_token:
        return jsonify({"error": "Access token not found"}), 400

    user_info_res = requests.get(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    if not user_info_res.ok:
        return jsonify({"error": "Failed to retrieve user info"}), 400

    user_info = user_info_res.json()
    email = user_info.get("email")
    if not email:
        return jsonify({'error': 'Google login failed'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(email=email)
        db.session.add(user)
        db.session.commit()

    token = jwt.encode(
        {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=12)
        },
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )

    return redirect(f"http://localhost:5173?token={token}")
