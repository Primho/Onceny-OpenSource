from flask import Blueprint, jsonify, request, session
from auth_helpers import get_user_card, login_required
from models import get_db, serialize_card
import time

cards_bp = Blueprint('cards', __name__)

TEMPORAL_TTL_MS = 120_000


def _purge_expired_temporal(conn, user_id):
    current_time = int(time.time() * 1000)
    conn.execute(
        '''
        DELETE FROM cards
        WHERE type = 'temporal'
                    AND user_id = ?
          AND created_at IS NOT NULL
          AND (? - created_at) >= ?
        ''',
                (user_id, current_time, TEMPORAL_TTL_MS),
    )
    conn.commit()


@cards_bp.route('/api/cards', methods=['GET'])
@login_required
def get_cards():
    conn = get_db()
    user_id = session['user_id']
    _purge_expired_temporal(conn, user_id)

    # Listado "ligero" para el grid: sin pages/blocks, igual que antes.
    rows = conn.execute(
        'SELECT * FROM cards WHERE user_id = ? ORDER BY id DESC',
        (user_id,),
    ).fetchall()
    cards = [serialize_card(row, conn=conn) for row in rows]
    conn.close()
    return jsonify(cards)


@cards_bp.route('/api/cards/<int:id>', methods=['GET'])
@login_required
def get_card(id):
    conn = get_db()
    row = get_user_card(conn, id)

    if row is None:
        conn.close()
        return jsonify({'message': 'Card not found'}), 404

    # Detalle completo: incluye pages -> blocks, para abrir el dialog.
    card = serialize_card(row, with_pages=True, conn=conn)
    conn.close()
    return jsonify(card)


@cards_bp.route('/api/cards', methods=['POST'])
@login_required
def create_card():
    data = request.get_json()
    now = int(time.time() * 1000)
    conn = get_db()

    cursor = conn.execute(
        '''
        INSERT INTO cards (user_id, title, color, tag, marker, type, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		RETURNING id
        ''',
        (
            session['user_id'],
            data.get('title', ''),
            data.get('color', '#f1f1f1'),
            data.get('tag', ''),
            data.get('marker', '📌'),
            data.get('type', 'normal'),
            data.get('createdAt', now),
            now,
        ),
    )
    card_id = cursor.fetchone()['id']

    # Toda card nace con una página por defecto y un bloque de texto vacío,
    # que es exactamente lo que page.js monta "a mano" en el DOM hoy.
    page_cursor = conn.execute(
        'INSERT INTO pages (card_id, title, emoji, position) VALUES (?, ?, ?, ?) RETURNING id',
        (card_id, 'Page 1', '📄', 0),
    )
    page_id = page_cursor.fetchone()['id']

    conn.execute(
        'INSERT INTO blocks (page_id, type, content, position) VALUES (?, ?, ?, ?)',
        (page_id, 'text', '', 0),
    )

    conn.commit()
    row = get_user_card(conn, card_id)
    card = serialize_card(row, with_pages=True, conn=conn)
    conn.close()

    return jsonify(card), 201


@cards_bp.route('/api/cards/<int:id>', methods=['PUT'])
@login_required
def update_card(id):
    data = request.get_json()
    conn = get_db()
    if get_user_card(conn, id) is None:
        conn.close()
        return jsonify({'message': 'Card not found'}), 404

    allowed_fields = {
        'title': 'title',
        'color': 'color',
        'tag': 'tag',
        'marker': 'marker',
    }
    fields_to_update = {allowed_fields[f]: data[f] for f in allowed_fields if f in data}

    if not fields_to_update:
        conn.close()
        return jsonify({'message': 'Nothing to update'}), 400

    fields_to_update['updated_at'] = int(time.time() * 1000)

    set_clause = ', '.join(f'{field} = ?' for field in fields_to_update)
    values = list(fields_to_update.values()) + [id]

    values.append(session['user_id'])
    conn.execute(f'UPDATE cards SET {set_clause} WHERE id = ? AND user_id = ?', values)
    conn.commit()
    conn.close()
    return jsonify({'message': 'Note edited'})


@cards_bp.route('/api/cards/<int:id>', methods=['DELETE'])
@login_required
def delete_card(id):
    conn = get_db()
    if get_user_card(conn, id) is None:
        conn.close()
        return jsonify({'message': 'Card not found'}), 404
    # Gracias a ON DELETE CASCADE + PRAGMA foreign_keys=ON, esto también
    # borra sus pages y los blocks de esas pages.
    conn.execute(
        'DELETE FROM cards WHERE id = ? AND user_id = ?',
        (id, session['user_id']),
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Note deleted'})