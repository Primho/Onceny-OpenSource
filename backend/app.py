
import os

from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.cards import cards_bp
from routes.pages import pages_bp
from routes.blocks import blocks_bp
from models import init_db

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-me')
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None' if os.environ.get('FRONTEND_URL') else 'Lax'
app.config['SESSION_COOKIE_SECURE'] = bool(os.environ.get('FRONTEND_URL'))

frontend_origins = [
    origin.strip()
    for origin in os.environ.get(
        'FRONTEND_URL',
        'http://localhost:5173,http://127.0.0.1:5173',
    ).split(',')
    if origin.strip()
]
CORS(
    app,
    origins=frontend_origins,
    supports_credentials=True,
)

app.register_blueprint(auth_bp)
app.register_blueprint(cards_bp)
app.register_blueprint(pages_bp)
app.register_blueprint(blocks_bp)


with app.app_context():
    init_db()

@app.route('/')
def home():
    return 'Hola desde Flask'

if __name__ == '__main__':
    app.run(debug=True)