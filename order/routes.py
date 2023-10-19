import pika
import os
from dotenv import load_dotenv
import json
from flask import Blueprint, jsonify, request
import requests
from models import Coffee,  db
order_blueprint = Blueprint(
    'order_api_routes', __name__, url_prefix="/")
# AUTH_API_URL = 'http://localhost:5001/check_auth'
load_dotenv()


def send_message(body, routing_key, queue_name, host='localhost'):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host))
    channel = connection.channel()
    channel.queue_declare(queue=queue_name, durable=True)  # Declare as durable

    channel.basic_publish(
        exchange='', routing_key=routing_key, body=body.encode())
    print(f"[x] Sent: {body}")

    connection.close()


def get_user(api_key):
    # print('get_user')
    # print(api_key)
    headers = {
        'Authorization': f'{api_key}'
    }

    response = requests.get(
        os.getenv('AUTH_API_URL', 'http://localhost:5001/check_auth'), headers=headers)
    # response = requests.get(AUTH_API_URL, headers=headers)
    # print('get_user')
    # print(response)
    if response.status_code != 200:
        return {'message': 'Not Authorized'}

    user = response.json()
    # print('get_user')
    # print(user)
    return user


@order_blueprint.route('/', methods=['GET'])
def get_open_order():
    api_key = request.headers.get('Authorization')
    # print(api_key)
    if not api_key:
        return jsonify({'message': 'Not logged in 1'}), 401
    response = get_user(api_key)
    print(response)
    user = response.get('result')
    if not user:
        return jsonify({'message': 'Not logged in 2'}), 401

    open_order = Order.query.filter_by(user_id=user['id'], is_open=1).first()
    if open_order:
        return jsonify({
            'result': open_order.serialize()
        }), 200
    else:
        return jsonify({'message': 'No open orders'})


@order_blueprint.route('/all', methods=['GET'])
def all_coffees():
    coffees = Coffee.query.all()

    # Convert the coffee items to a list of dictionaries
    coffee_list = []
    for coffee in coffees:
        coffee_data = {
            'id': coffee.id,
            'name': coffee.name,
            'quantity': coffee.quantity,
            'is_open': coffee.is_open
        }
        coffee_list.append(coffee_data)

    return jsonify(coffee_list)


# def all_orders():
# orders = Coffee.query.all()
# result = [order.serialize() for order in orders]
# return jsonify(result), 200


@order_blueprint.route('/add-coffee', methods=['POST'])
def add_coffee():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid data format'}), 400

    name = data.get('name')
    quantity = data.get('quantity')
    # Set a default value of True if 'is_open' is not provided
    is_open = data.get('is_open', True)

    if not name or not quantity:
        return jsonify({'message': 'Name and quantity are required'}), 400

    coffee = Coffee(name=name, quantity=quantity, is_open=is_open)
    db.session.add(coffee)
    db.session.commit()

    return jsonify({'message': 'Coffee added successfully'}), 200


# Get a coffee by its ID
@order_blueprint.route('/<int:id>', methods=['GET'])
def get_coffee_by_id(id):
    coffee = Coffee.query.get(id)

    if coffee is None:
        return jsonify({'message': 'Coffee not found'}), 404

    coffee_data = {
        'id': coffee.id,
        'name': coffee.name,
        'quantity': coffee.quantity,
        'is_open': coffee.is_open
    }

    return jsonify(coffee_data), 200


@order_blueprint.route('/<int:id>', methods=['PUT'])
def update_coffee(id):
    data = request.get_json()

    if 'name' not in data or 'quantity' not in data or 'is_open' not in data:
        return jsonify({'message': 'Name, quantity, and is_open are required in the request data'}), 400

    coffee = Coffee.query.get(id)

    if coffee is None:
        return jsonify({'message': 'Coffee not found'}), 404

    coffee.name = data['name']
    coffee.quantity = data['quantity']
    coffee.is_open = data['is_open']

    db.session.commit()

    return jsonify({'message': 'Coffee updated successfully'}), 200
