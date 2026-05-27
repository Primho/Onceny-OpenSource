import os
import sqlite3

DB_PATH = os.path.join(os.path.expanduser('~'), 'prizma.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        color TEXT DEFAULT '#f1f1f1',
        tag TEXT,
        marker TEXT,
        type TEXT DEFAULT 'normal',
        createdAt INTEGER
        )
    ''')
    conn.commit()
    conn.close()