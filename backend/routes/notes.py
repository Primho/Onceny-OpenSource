from flask import Blueprint

notes_bp = Blueprint('notes', __name__)

@notes_bp.route('/notes')
def home():
    return 'Hola se supone que es una card'