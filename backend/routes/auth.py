import time

from flask import Blueprint, jsonify, request, session
from werkzeug.security import check_password_hash, generate_password_hash

from models import get_db


auth_bp = Blueprint('auth', __name__)


def user_response(user):
	return {
		'id': user['id'],
		'username': user['username'],
		'email': user['email'],
	}


@auth_bp.route('/api/auth/signup', methods=['POST'])
def signup():
	data = request.get_json() or {}
	username = data.get('username', '').strip()
	email = data.get('email', '').strip().lower()
	password = data.get('password', '')

	if not username or not email or not password:
		return jsonify({'message': 'Username, email and password are required'}), 400

	if len(password) < 6:
		return jsonify({'message': 'Password must have at least 6 characters'}), 400

	conn = get_db()
	existing_user = conn.execute(
		'SELECT id FROM users WHERE email = ?',
		(email,),
	).fetchone()

	if existing_user is not None:
		conn.close()
		return jsonify({'message': 'Email is already registered'}), 409

	cursor = conn.execute(
		'''
		INSERT INTO users (username, email, password_hash, created_at)
		VALUES (?, ?, ?, ?)
		RETURNING id
		''',
		(
			username,
			email,
			generate_password_hash(password, method='pbkdf2:sha256'),
			int(time.time()),
		),
	)
	conn.commit()

	user = conn.execute(
		'SELECT id, username, email FROM users WHERE id = ?',
		(cursor.fetchone()['id'],),
	).fetchone()
	conn.close()

	session.clear()
	session['user_id'] = user['id']
	return jsonify({'user': user_response(user)}), 201


@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
	data = request.get_json() or {}
	email = data.get('email', '').strip().lower()
	password = data.get('password', '')

	conn = get_db()
	user = conn.execute(
		'SELECT * FROM users WHERE email = ?',
		(email,),
	).fetchone()
	conn.close()

	if user is None or not check_password_hash(user['password_hash'], password):
		return jsonify({'message': 'Invalid email or password'}), 401

	session.clear()
	session['user_id'] = user['id']
	return jsonify({'user': user_response(user)})


@auth_bp.route('/api/auth/me', methods=['GET'])
def current_user():
	user_id = session.get('user_id')

	if user_id is None:
		return jsonify({'message': 'Not authenticated'}), 401

	conn = get_db()
	user = conn.execute(
		'SELECT id, username, email FROM users WHERE id = ?',
		(user_id,),
	).fetchone()
	conn.close()

	if user is None:
		session.clear()
		return jsonify({'message': 'Not authenticated'}), 401

	return jsonify({'user': user_response(user)})


@auth_bp.route('/api/auth/logout', methods=['POST'])
def logout():
	session.clear()
	return jsonify({'message': 'Logged out'})
