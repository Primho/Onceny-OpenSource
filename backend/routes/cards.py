from flask import Blueprint, jsonify

cards_bp = Blueprint('cards', __name__)

@cards_bp.route('/cards', methods=['GET'])
def get_notes():
    return jsonify([])

