
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
CORS(
    app,
    origins=['http://localhost:5173', 'http://127.0.0.1:5173'],
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