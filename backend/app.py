from flask import Flask
from routes.notes import notes_bp

app = Flask(__name__)
app.register_blueprint(notes_bp)

@app.route('/')
def home():
    return 'Hola desde Flask'

if __name__ == '__main__':
    app.run(debug=True)