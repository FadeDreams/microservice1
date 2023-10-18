from flask import Flask, jsonify, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String
import os

from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_marshmallow import Marshmallow
from flask_cors import CORS

from models import db, User
from user import UserSchema

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + \
    os.path.join(basedir, os.getenv('DBNAME', 'users.db'))

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'secret')

db.init_app(app)
ma = Marshmallow(app)
jwt = JWTManager(app)


@app.route('/')
def index():
    return jsonify({'message': 'auth service is running'})


@app.cli.command('db_create')
def db_create():
    db.create_all()
    print('Database created!')


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify(message='Invalid JSON data'), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify(message='Email and password are required'), 400

    # Check if the email already exists
    test = User.query.filter_by(email=email).first()
    if test:
        return jsonify(message='That email already exists.'), 409

    # Create the user
    user = User(email=email, password=password)
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity=email)
    return jsonify({'user': user.serialize(), 'access_token': access_token}), 201
    # return jsonify(message="User created successfully."), 201


@app.route('/login', methods=['POST'])
def login():
    if request.is_json:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
    else:
        email = request.form.get('email')
        password = request.form.get('password')

    if not email or not password:
        return jsonify(message='Email and password are required'), 400

    test = User.query.filter_by(email=email, password=password).first()

    # return jsonify({'result': user.serialize()}), 200
    if test:
        access_token = create_access_token(identity=email)
        return jsonify({'user': test.serialize(), 'access_token': access_token}), 200
    else:
        return jsonify(message="Bad email or password"), 401


@app.route('/check_auth', methods=['GET'])
@jwt_required
def check_authentication():
    # If the request reaches this point, it means the provided access token is valid.
    # You can get the user's email from the token and perform further authentication checks.
    current_user_email = get_jwt_identity()

    # Perform additional checks if needed.
    # For example, you can check if the user exists in your database.
    user = User.query.filter_by(email=current_user_email).first()

    if user:
        # return jsonify({'message': 'User is authenticated'}), 200
        return jsonify({'result': user.serialize()}), 200
    else:
        return jsonify({'message': 'User is not authenticated'}), 401


if __name__ == '__main__':
    app.run(debug=True, port=os.getenv('APPPORT', 5001))
