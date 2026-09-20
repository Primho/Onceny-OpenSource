import os
import sqlite3

DB_PATH = os.path.join(os.path.expanduser('~'), 'onceny.db')
DATABASE_URL = os.environ.get('DATABASE_URL')
POSTGRES_POOL = None


class PostgresConnection:
    def __init__(self, connection, pool):
        self.connection = connection
        self.pool = pool

    def execute(self, query, parameters=()):
        return self.connection.execute(query.replace('?', '%s'), parameters)

    def commit(self):
        self.connection.commit()

    def rollback(self):
        self.connection.rollback()

    def close(self):
        self.pool.putconn(self.connection)


def _postgres_connection():
    from psycopg_pool import ConnectionPool
    from psycopg.rows import dict_row

    global POSTGRES_POOL
    if POSTGRES_POOL is None:
        POSTGRES_POOL = ConnectionPool(
            conninfo=DATABASE_URL.replace('postgres://', 'postgresql://', 1),
            kwargs={'row_factory': dict_row},
            min_size=1,
            max_size=5,
            timeout=10,
            open=True,
        )

    return PostgresConnection(POSTGRES_POOL.getconn(), POSTGRES_POOL)


def get_db():
    if DATABASE_URL:
        return _postgres_connection()

    conn = sqlite3.connect(DB_PATH)
    # Necesario en cada conexión: SQLite no aplica ON DELETE CASCADE
    # a menos que esta pragma esté activa en la conexión actual.
    conn.execute('PRAGMA foreign_keys = ON')
    conn.row_factory = sqlite3.Row
    return conn

def get_card_preview(card_id, conn):
    row = conn.execute('''
    SELECT blocks.content
    FROM blocks
    JOIN pages
    ON pages.id = blocks.page_id
    WHERE pages.card_id = ?
    ORDER BY pages.position ASC, blocks.position ASC
    LIMIT 1
    ''', (card_id,)).fetchone()

    if row:
        return row['content']

    return ''


def init_db():
    conn = get_db()

    if DATABASE_URL:
        _init_postgres_db(conn)
        conn.close()
        return

    conn.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL
    )
    ''')

    conn.execute('''
    CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL DEFAULT '',
        color TEXT DEFAULT '#f1f1f1',
        tag TEXT DEFAULT '',
        marker TEXT DEFAULT '',
        type TEXT DEFAULT 'normal',
        created_at INTEGER,
        updated_at INTEGER
    )
    ''')

    card_columns = conn.execute('PRAGMA table_info(cards)').fetchall()
    has_user_id = any(column['name'] == 'user_id' for column in card_columns)

    if not has_user_id:
        conn.execute('ALTER TABLE cards ADD COLUMN user_id INTEGER')

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
    conn.execute('CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id)')

    conn.commit()
    conn.close()


def _init_postgres_db(conn):
    conn.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at BIGINT NOT NULL
    )
    ''')
    conn.execute('''
    CREATE TABLE IF NOT EXISTS cards (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT REFERENCES users(id),
        title TEXT NOT NULL DEFAULT '',
        color TEXT DEFAULT '#f1f1f1',
        tag TEXT DEFAULT '',
        marker TEXT DEFAULT '',
        type TEXT DEFAULT 'normal',
        created_at BIGINT,
        updated_at BIGINT
    )
    ''')
    conn.execute('''
    CREATE TABLE IF NOT EXISTS pages (
        id BIGSERIAL PRIMARY KEY,
        card_id BIGINT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
        title TEXT DEFAULT '',
        emoji TEXT DEFAULT '📄',
        position INTEGER NOT NULL DEFAULT 0
    )
    ''')
    conn.execute('''
    CREATE TABLE IF NOT EXISTS blocks (
        id BIGSERIAL PRIMARY KEY,
        page_id BIGINT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
        type TEXT NOT NULL DEFAULT 'text',
        content TEXT DEFAULT '',
        checked INTEGER NOT NULL DEFAULT 0,
        position INTEGER NOT NULL DEFAULT 0
    )
    ''')
    conn.execute('CREATE INDEX IF NOT EXISTS idx_pages_card_id ON pages(card_id)')
    conn.execute('CREATE INDEX IF NOT EXISTS idx_blocks_page_id ON blocks(page_id)')
    conn.execute('CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id)')
    conn.commit()


# ---------- Helpers de serialización ----------
# Mantienen el mismo "shape" de JSON que ya consume main.js/card.js,
# aunque las columnas internas estén en snake_case.

def serialize_card(row, with_pages=False, conn=None):
    card = {
        'id': row['id'],
        'preview': row['preview'] if 'preview' in row.keys() else get_card_preview(row['id'], conn) if conn else '',
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