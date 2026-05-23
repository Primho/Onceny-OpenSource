from flask import Flask
from flask_cors import CORS
from routes.cards import cards_bp
from models import init_db

app = Flask(__name__)
CORS(app)
app.register_blueprint(cards_bp)

with app.app_context():
    init_db()

@app.route('/')
def home():
    return 'Hola desde Flask'

if __name__ == '__main__':
    app.run(debug=True)