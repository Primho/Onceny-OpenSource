from flask import Blueprint, jsonify, request
from models import get_db
import time

cards_bp = Blueprint('cards', __name__)

@cards_bp.route('/api/cards', methods=['GET'])
def get_notes():
    conn = get_db()

    # Obtener timestamp actual en milisegundos idéntico a Date.now()
    current_time = int(time.time() * 1000)
    # Límite máximo de vida de la tarjeta (2 minutos = 120,000 ms)
    top_allowed_time = 120000

    # Limpieza atómica proactiva antes de enviar los datos
    conn.execute('''
        DELETE FROM cards
        WHERE type = 'temporal' AND (? - createdAt) >= ?
    ''', (current_time, top_allowed_time))
    conn.commit()

    # Recuperamos el set de datos limpio resultante de la purga
    cards = conn.execute('SELECT * FROM cards').fetchall()
    conn.close()
    return jsonify([dict(card) for card in cards])

@cards_bp.route('/api/cards', methods=['POST'])
def create_card():
    data = request.get_json()
    conn = get_db()
    cursor = conn.execute(
        'INSERT INTO cards (title, color, tag, marker, type, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
        (
            data.get('title', ''),
            data.get('color', '#f1f1f1'),
            data.get('tag', ''),
            data.get('marker', '📌'),
            data.get('type', 'normal'),
            data.get('createdAt', None)
        )
    )
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({
        'id': new_id,
        'title': data.get('title', ''),
        'color': data.get('color', '#f1f1f1'),
        'tag': data.get('tag', ''),
        'marker': data.get('marker', '📌'),
        'type': data.get('type', 'normal'),
        'createdAt': data.get('createdAt', None)
    }), 201

@cards_bp.route('/api/cards/<int:id>', methods=['PUT'])
def update_card(id):
    data = request.get_json()
    conn = get_db()

    # UPDATE extensible para soportar la mutación de colores y tags en caliente
    conn.execute('''
        UPDATE cards
        SET title = ?, color = ?, tag = ?, marker = ?
        WHERE id = ?
    ''', (
        data.get('title', ''),
        data.get('color', '#f1f1f1'),
        data.get('tag', ''),
        data.get('marker', ''),
        id
    ))

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