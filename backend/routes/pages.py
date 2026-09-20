from flask import Blueprint, jsonify, request
from auth_helpers import get_user_card, get_user_page, login_required
from models import get_db, serialize_page

pages_bp = Blueprint('pages', __name__)


@pages_bp.route('/api/cards/<int:card_id>/pages', methods=['POST'])
@login_required
def create_page(card_id):
    data = request.get_json() or {}
    conn = get_db()

    card = get_user_card(conn, card_id)
    if card is None:
        conn.close()
        return jsonify({'message': 'Card not found'}), 404

    max_pos = conn.execute(
        'SELECT COALESCE(MAX(position), -1) AS max_pos FROM pages WHERE card_id = ?',
        (card_id,),
    ).fetchone()['max_pos']

    cursor = conn.execute(
        'INSERT INTO pages (card_id, title, emoji, position) VALUES (?, ?, ?, ?) RETURNING id',
        (card_id, data.get('title', ''), data.get('emoji', '📄'), max_pos + 1),
    )
    page_id = cursor.fetchone()['id']

    # Página nueva arranca con un bloque de texto vacío, igual que hoy en el DOM.
    conn.execute(
        'INSERT INTO blocks (page_id, type, content, position) VALUES (?, ?, ?, ?)',
        (page_id, 'text', '', 0),
    )

    conn.commit()
    row = conn.execute('SELECT * FROM pages WHERE id = ?', (page_id,)).fetchone()
    page = serialize_page(row, conn=conn, with_blocks=True)
    conn.close()

    return jsonify(page), 201


@pages_bp.route('/api/pages/<int:id>', methods=['PUT'])
@login_required
def update_page(id):
    data = request.get_json() or {}
    conn = get_db()

    if get_user_page(conn, id) is None:
        conn.close()
        return jsonify({'message': 'Page not found'}), 404

    allowed_fields = ['title', 'emoji', 'position']
    fields_to_update = {f: data[f] for f in allowed_fields if f in data}

    if not fields_to_update:
        conn.close()
        return jsonify({'message': 'Nothing to update'}), 400

    set_clause = ', '.join(f'{field} = ?' for field in fields_to_update)
    values = list(fields_to_update.values()) + [id]

    conn.execute(f'UPDATE pages SET {set_clause} WHERE id = ?', values)
    conn.commit()
    conn.close()
    return jsonify({'message': 'Page edited'})


@pages_bp.route('/api/cards/<int:card_id>/pages/reorder', methods=['PUT'])
@login_required
def reorder_pages(card_id):
    # Espera: { "order": [page_id_1, page_id_2, ...] } en el nuevo orden.
    data = request.get_json() or {}
    order = data.get('order', [])
    conn = get_db()

    if get_user_card(conn, card_id) is None:
        conn.close()
        return jsonify({'message': 'Card not found'}), 404

    for index, page_id in enumerate(order):
        conn.execute(
            'UPDATE pages SET position = ? WHERE id = ? AND card_id = ?',
            (index, page_id, card_id),
        )

    conn.commit()
    conn.close()
    return jsonify({'message': 'Pages reordered'})


@pages_bp.route('/api/pages/<int:id>', methods=['DELETE'])
@login_required
def delete_page(id):
    conn = get_db()
    page = get_user_page(conn, id)

    if page is None:
        conn.close()
        return jsonify({'message': 'Page not found'}), 404

    # ON DELETE CASCADE se encarga de sus blocks.
    conn.execute('DELETE FROM pages WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Page deleted'})