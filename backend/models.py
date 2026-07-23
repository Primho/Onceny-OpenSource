import os
import sqlite3

# Ubicación de la base de datos en el directorio home del usuario
DB_PATH = os.path.join(os.path.expanduser('~'), 'prizma.db')


def get_db():
    conn = sqlite3.connect(DB_PATH)
    # Necesario en cada conexión: SQLite no aplica ON DELETE CASCADE
    # a menos que esta pragma esté activa en la conexión actual.
    conn.execute('PRAGMA foreign_keys = ON')
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()

    conn.execute('''
    CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL DEFAULT '',
        color TEXT DEFAULT '#f1f1f1',
        tag TEXT DEFAULT '',
        marker TEXT DEFAULT '📌',
        type TEXT DEFAULT 'normal',
        created_at INTEGER,
        updated_at INTEGER
    )
    ''')

    conn.execute('''
    CREATE TABLE IF NOT EXISTS pages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        card_id INTEGER NOT NULL,
        title TEXT DEFAULT '',
        emoji TEXT DEFAULT '📄',
        position INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (card_id) REFERENCES cards (id) ON DELETE CASCADE
    )
    ''')

    conn.execute('''
    CREATE TABLE IF NOT EXISTS blocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        page_id INTEGER NOT NULL,
        type TEXT NOT NULL DEFAULT 'text',
        content TEXT DEFAULT '',
        checked INTEGER NOT NULL DEFAULT 0,
        position INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE
    )
    ''')

    conn.execute('CREATE INDEX IF NOT EXISTS idx_pages_card_id ON pages(card_id)')
    conn.execute('CREATE INDEX IF NOT EXISTS idx_blocks_page_id ON blocks(page_id)')

    conn.commit()
    conn.close()


# ---------- Helpers de serialización ----------
# Mantienen el mismo "shape" de JSON que ya consume main.js/card.js,
# aunque las columnas internas estén en snake_case.

def serialize_card(row, with_pages=False, conn=None):
    card = {
        'id': row['id'],
        'title': row['title'],
        'color': row['color'],
        'tag': row['tag'],
        'marker': row['marker'],
        'type': row['type'],
        'createdAt': row['created_at'],
        'updatedAt': row['updated_at'],
    }

    if with_pages and conn is not None:
        pages = conn.execute(
            'SELECT * FROM pages WHERE card_id = ? ORDER BY position ASC, id ASC',
            (row['id'],),
        ).fetchall()
        card['pages'] = [serialize_page(p, conn=conn, with_blocks=True) for p in pages]

    return card


def serialize_page(row, conn=None, with_blocks=False):
    page = {
        'id': row['id'],
        'cardId': row['card_id'],
        'title': row['title'],
        'emoji': row['emoji'],
        'position': row['position'],
    }

    if with_blocks and conn is not None:
        blocks = conn.execute(
            'SELECT * FROM blocks WHERE page_id = ? ORDER BY position ASC, id ASC',
            (row['id'],),
        ).fetchall()
        page['blocks'] = [serialize_block(b) for b in blocks]

    return page


def serialize_block(row):
    return {
        'id': row['id'],
        'pageId': row['page_id'],
        'type': row['type'],
        'content': row['content'],
        'checked': bool(row['checked']),
        'position': row['position'],
    }