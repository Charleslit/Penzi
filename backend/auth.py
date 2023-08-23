from flask import jsonify
import jwt
import datetime
from flask_bcrypt import Bcrypt
from functools import wraps

import requests



bcrypt = Bcrypt(app)

# Authorization decorator to check user roles
def requires_role(role):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):

            auth_header = requests.headers.get('Authorization')
            if not auth_header:
                return jsonify({'message': 'Missing Authorization header'}), 401

            try:
                token = auth_header.split()[1]
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])

                # Check if the token is blacklisted
                with cnx.cursor() as cursor:
                    query = "SELECT * FROM blacklist WHERE token = %s"
                    cursor.execute(query, (token,))
                    result = cursor.fetchone()

                if result:
                    return jsonify({'message': 'Token revoked'}), 401

                if data['role'] != role:
                    return jsonify({'message': 'Unauthorized'}), 403

            except jwt.ExpiredSignatureError:
                return jsonify({'message': 'Token has expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'message': 'Invalid token'}), 401

            return func(*args, **kwargs)

        return wrapper

    return decorator


# User registration route
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = 'user'  # Set default role for new users

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    # Check if the username already exists
    with cnx.cursor() as cursor:
        query = "SELECT * FROM users WHERE username = %s"
        cursor.execute(query, (username,))
        result = cursor.fetchone()
        if result:
            return jsonify({'message': 'Username already exists'}), 409

        # Hash the password and store the new user in the database
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        query = "INSERT INTO users (username, password, role) VALUES (%s, %s, %s)"
        cursor.execute(query, (username, hashed_password, role))
        cnx.commit()

    return jsonify({'message': 'User registered successfully'}), 201
# User authentication route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    with cnx.cursor() as cursor:
        query = "SELECT * FROM users WHERE username = %s"
        cursor.execute(query, (username,))
        user = cursor.fetchone()
        

    if not user or not bcrypt.check_password_hash(user[2], password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = jwt.encode({
        "username": username,
        'role': user[3],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({'token': token}), 200
@app.route('/Adminlogin', methods=['POST'])
@requires_role('admin')
def Adminlogin():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    with cnx.cursor() as cursor:
        query = "SELECT * FROM users WHERE username = %s AND role = %s"
        cursor.execute(query, (username,'admin'))
        user = cursor.fetchone()
        

    if not user or not bcrypt.check_password_hash(user[2], password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = jwt.encode({
        "username": username,
        'role': user[3],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    print(token)

    return jsonify({'token': token}), 200



# Refresh token route
@app.route('/refreshToken', methods=['POST'])
def refresh_token():
    data = request.get_json()
    refresh_token = data.get('refresh_token')

    if not refresh_token:
        return jsonify({'message': 'Refresh token is required'}), 400

    try:
        data = jwt.decode(refresh_token, app.config['SECRET_KEY'], algorithms=['HS256'])
        username = data['username']
        role = data['role']

        with cnx.cursor() as cursor:

            query = "SELECT * FROM refresh_token WHERE username = %s AND token = %s"
            cursor.execute(query, (username, refresh_token))
            result = cursor.fetchone()

        if result:
            new_token = jwt.encode({
                'username': username,
                'role': role,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
            }, app.config['SECRET_KEY'], algorithm='HS256')

            return jsonify({'new_token': new_token}), 200

        return jsonify({'message': 'Invalid refresh token'}), 401

    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid refresh token'}), 401


# Logout route
@app.route('/logout', methods=['POST'])
@requires_role('user')
def logout():
    auth_header = request.headers.get('Authorization')

    if not auth_header:
        return jsonify({'message': 'Missing authorization header'}), 401

    try:
        token = auth_header.split()[1]
        with cnx.cursor() as cursor:
            query = "INSERT INTO blacklist (token) VALUES (%s)"
            cursor.execute(query, (token,))
            cnx.commit()
           

        return jsonify({'message': 'Logged out successfully'}), 200

    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401
# User data route
@app.route('/userdata', methods=['GET'])
@requires_role('user')
def get_userdata():
    return jsonify({'message': 'This is user-sensitive data'}), 200

# Admin data route
@app.route('/admin-data', methods=['GET'])
@requires_role('admin')
def get_admin_data():
    return jsonify({'message': 'This is sensitive admin data'}), 200
