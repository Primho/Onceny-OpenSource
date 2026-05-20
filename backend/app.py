from flask import Flask
from routes.cards import notes_bp
from models import init_db

app = Flask(__name__)
app.register_blueprint(notes_bp)

with app.app_context():
    init_db()

@app.route('/')
def home():
    return 'Hola desde Flask'

if __name__ == '__main__':
    app.run(debug=True)