from flask import Blueprint, jsonify, request
from models import get_db

cards_bp = Blueprint('cards', __name__)

@cards_bp.route('/api/cards', methods=['GET'])
def get_notes():
    conn = get_db()
    cards = conn.execute('SELECT * FROM cards').fetchall()
    conn.close()
    return jsonify([dict(card) for card in cards])

@cards_bp.route('/api/cards', methods=['POST'])
def create_card():
    data = request.get_json()
    conn = get_db()
    cursor = conn.execute(
        'INSERT INTO cards (title, color, tag, marker) VALUES (?, ?, ?, ?)',
        (data['title'], data['color'], data.get('tag', ''), data.get('marker', ''))
    )
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return jsonify({
        'id': new_id,
        'title': data['title'],
        'color': data['color'],
        'tag': data.get('tag', ''),
        'marker': data.get('marker', '')
    }), 201

@cards_bp.route('/api/cards/<int:id>', methods=['PUT'])
def update_card(id):
    data = request.get_json()
    conn = get_db()
    conn.execute('UPDATE cards SET title = ? WHERE id = ?', (data['title'], id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Note edited'})

@cards_bp.route('/api/cards/<int:id>', methods=['DELETE'])
def delete_card(id):
    conn = get_db()
    conn.execute('DELETE FROM cards WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Note deleted'})