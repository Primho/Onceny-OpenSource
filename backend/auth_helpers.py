from functools import wraps

from flask import jsonify, session


def login_required(view_function):
    @wraps(view_function)
    def wrapped_view(*args, **kwargs):
        if session.get('user_id') is None:
            return jsonify({'message': 'Authentication required'}), 401

        return view_function(*args, **kwargs)

    return wrapped_view


def get_user_card(conn, card_id):
    user_id = session.get('user_id')
    return conn.execute(
        'SELECT * FROM cards WHERE id = ? AND user_id = ?',
        (card_id, user_id),
    ).fetchone()


def get_user_page(conn, page_id):
    user_id = session.get('user_id')
    return conn.execute(
        '''
        SELECT pages.*
        FROM pages
        JOIN cards ON cards.id = pages.card_id
        WHERE pages.id = ? AND cards.user_id = ?
        ''',
        (page_id, user_id),
    ).fetchone()


def get_user_block(conn, block_id):
    user_id = session.get('user_id')
    return conn.execute(
        '''
        SELECT blocks.*
        FROM blocks
        JOIN pages ON pages.id = blocks.page_id
        JOIN cards ON cards.id = pages.card_id
        WHERE blocks.id = ? AND cards.user_id = ?
        ''',
        (block_id, user_id),
    ).fetchone()