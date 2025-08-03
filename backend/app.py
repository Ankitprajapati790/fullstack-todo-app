from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from dotenv import load_dotenv
import os
from pathlib import Path

# Load environment variables
load_dotenv(dotenv_path=Path(__file__).resolve().parent / '.env')

# Initialize extensions
from extensions import db, mail

def create_app():
    app = Flask(__name__)

    # ✅ CORS configuration (adjust frontend origin if needed)
    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

    # ✅ Config from .env
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SECRET_KEY'] = os.getenv('JWT_SECRET', 'supersecretkey')
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USER')
    app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASS')

    # ✅ Debug checks
    print("📌 DATABASE_URL:", app.config['SQLALCHEMY_DATABASE_URI'])
    print("📌 EMAIL_USER:", app.config['MAIL_USERNAME'])

    if not app.config['SQLALCHEMY_DATABASE_URI']:
        raise RuntimeError("❌ DATABASE_URL is not set in .env file")

    # ✅ Init extensions
    db.init_app(app)
    mail.init_app(app)

    # ✅ Register blueprints
    from routes import todo_bp
    from auth import auth_bp
    app.register_blueprint(todo_bp)
    app.register_blueprint(auth_bp)

    # ✅ Add default route to avoid 404 on root
    @app.route("/")
    def home():
        return {"message": "✅ Flask backend is up and running!"}

    # ✅ Debug route to list all registered routes
    @app.route("/routes")
    def list_routes():
        import urllib
        output = []
        for rule in app.url_map.iter_rules():
            methods = ','.join(rule.methods)
            line = urllib.parse.unquote(f"{rule.endpoint:30s} {methods:20s} {str(rule)}")
            output.append(line)
        return "<pre>" + "\n".join(sorted(output)) + "</pre>"

    return app

# Entrypoint
if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)
