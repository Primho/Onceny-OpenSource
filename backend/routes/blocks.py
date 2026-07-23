from flask import Blueprint, jsonify, request
from models import get_db, serialize_block

blocks_bp = Blueprint('blocks', __name__)

VALID_TYPES = {'text', 'heading', 'subheading', 'task'}


@blocks_bp.route('/api/pages/<int:page_id>/blocks', methods=['POST'])
def create_block(page_id):
    data = request.get_json() or {}
    conn = get_db()

    page = conn.execute('SELECT id FROM pages WHERE id = ?', (page_id,)).fetchone()
    if page is None:
        conn.close()
        return jsonify({'message': 'Page not found'}), 404

    block_type = data.get('type', 'text')
    if block_type not in VALID_TYPES:
        block_type = 'text'

    max_pos = conn.execute(
        'SELECT COALESCE(MAX(position), -1) AS max_pos FROM blocks WHERE page_id = ?',
        (page_id,),
    ).fetchone()['max_pos']

    # Permite insertar en una posición concreta (ej. justo después del bloque actual);
    # si no se manda, va al final.
    position = data.get('position', max_pos + 1)

    cursor = conn.execute(
        'INSERT INTO blocks (page_id, type, content, checked, position) VALUES (?, ?, ?, ?, ?)',
        (page_id, block_type, data.get('content', ''), int(bool(data.get('checked', False))), position),
    )
    block_id = cursor.lastrowid

    conn.commit()
    row = conn.execute('SELECT * FROM blocks WHERE id = ?', (block_id,)).fetchone()
    block = serialize_block(row)
    conn.close()

    return jsonify(block), 201


@blocks_bp.route('/api/blocks/<int:id>', methods=['PUT'])
def update_block(id):
    data = request.get_json() or {}
    conn = get_db()

    fields_to_update = {}
    if 'type' in data and data['type'] in VALID_TYPES:
        fields_to_update['type'] = data['type']
    if 'content' in data:
        fields_to_update['content'] = data['content']
    if 'checked' in data:
        fields_to_update['checked'] = int(bool(data['checked']))
    if 'position' in data:
        fields_to_update['position'] = data['position']

    if not fields_to_update:
        conn.close()
        return jsonify({'message': 'Nothing to update'}), 400

    set_clause = ', '.join(f'{field} = ?' for field in fields_to_update)
    values = list(fields_to_update.values()) + [id]

    conn.execute(f'UPDATE blocks SET {set_clause} WHERE id = ?', values)
    conn.commit()
    conn.close()
    return jsonify({'message': 'Block edited'})


@blocks_bp.route('/api/pages/<int:page_id>/blocks/reorder', methods=['PUT'])
def reorder_blocks(page_id):
    # Espera: { "order": [block_id_1, block_id_2, ...] } en el nuevo orden.
    data = request.get_json() or {}
    order = data.get('order', [])
    conn = get_db()

    for index, block_id in enumerate(order):
        conn.execute(
            'UPDATE blocks SET position = ? WHERE id = ? AND page_id = ?',
            (index, block_id, page_id),
        )

    conn.commit()
    conn.close()
    return jsonify({'message': 'Blocks reordered'})


@blocks_bp.route('/api/blocks/<int:id>', methods=['DELETE'])
def delete_block(id):
    conn = get_db()
    conn.execute('DELETE FROM blocks WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Block deleted'})