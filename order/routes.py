import pika
import os
from dotenv import load_dotenv
import json
from flask import Blueprint, jsonify, request
import requests
from models import Coffee,  db
order_blueprint = Blueprint(
    'order_api_routes', __name__, url_prefix="/")
# USER_API_URL = 'http://localhost:5001/check_auth'


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
        # 'Authorization': f'Bearer {api_key}'
        'Authorization': f'{api_key}'
        # 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY5NzI5MTUwNiwianRpIjoiNjBhMWY3ZDAtZjQ0Mi00MjE3LWIzM2EtMTE5MDYyNDYzZDQxIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InhAeC5jb20iLCJuYmYiOjE2OTcyOTE1MDYsImV4cCI6MTY5NzI5MjQwNn0.wrfnV9zYK-Iyc9ba4OYV8fNoMHmIwPD7r9wiJLhcyw0'
    }

    response = requests.get(
        os.getenv('USER_API_URL', 'http://localhost:5001/check_auth'), headers=headers)
    # response = requests.get(USER_API_URL, headers=headers)
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


# @order_blueprint.route('/add-coffee', methods=['POST'])
# def add_order_item():
    # api_key = request.headers.get('Authorization')
    # if not api_key:
    # return jsonify({'message': 'Not logged in add_order_item1'}), 401

    # response = get_user(api_key)
    # if not response.get('result'):
    # return jsonify({'message': 'Not logged in add_order_item2'}), 401

    # user = response.get('result')

    # # Change this to parse JSON data from the request body
    # data = request.get_json()

    # if data is None:
    # return jsonify({'message': 'Invalid data format'}), 400

    # coffee_id = int(data.get('coffee_id'))
    # quantity = int(data.get('quantity'))
    # # user_id = user['id']
    # user_id = 2

    # open_order = Order.query.filter_by(user_id=user_id, is_open=1).first()

    # if not open_order:
    # open_order = Order()
    # open_order.is_open = True
    # open_order.user_id = user_id

    # order_item = OrderItem(coffee_id=coffee_id, quantity=quantity)
    # open_order.order_items.append(order_item)
    # else:
    # found = False
    # for item in open_order.order_items:
    # if item.coffee_id == coffee_id:
    # item.quantity += quantity
    # found = True

    # if not found:
    # order_item = OrderItem(coffee_id=coffee_id, quantity=quantity)
    # open_order.order_items.append(order_item)

    # db.session.add(open_order)
    # db.session.commit()

    # return jsonify({'message': 'Order item added successfully'}), 200


@order_blueprint.route('/checkout', methods=['POST'])
def checkout():
    api_key = request.headers.get('Authorization')
    if not api_key:
        return jsonify({'message': 'Not logged in'}), 401
    response = get_user(api_key)
    user = response.get('result')
    if not user:
        return jsonify({'message': 'Not logged in'}), 401

    open_order = Order.query.filter_by(user_id=user['id'], is_open=1).first()

    if open_order:
        open_order.is_open = False

        db.session.add(open_order)
        db.session.commit()
        return jsonify({'result': open_order.serialize()})
    else:
        return jsonify({'message': 'no open orders'})


@order_blueprint.route('/<int:order_id>', methods=['GET'])
def getorderbyid(order_id):
    # api_key = request.headers.get('Authorization')
    # if not api_key:
    # return jsonify({'message': 'Not logged in'}), 401

    # response = get_user(api_key)
    # user = response.get('result')
    # if not user:
    # return jsonify({'message': 'Not logged in'}), 401

    # Query the database to get the order by ID for the logged-in user
    # order = Order.query.filter_by(id=order_id, user_id=user['id']).first()
    order = Order.query.filter_by(id=order_id).first()

    if not order:
        return jsonify({'message': 'Order not found'}), 404

    message_body = json.dumps(order.serialize())
    send_message(message_body, 'queue1', 'queue1')
    return jsonify({'result': order.serialize()}), 200


@order_blueprint.route('/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    # Check if the request contains JSON data
    if not request.is_json:
        return jsonify({'message': 'Invalid JSON data'}), 400

    # Parse the JSON data from the request
    data = request.get_json()

    # Check if 'is_open' is present in the JSON data
    if 'is_open' not in data:
        return jsonify({'message': 'Missing "is_open" in JSON data'}), 400

    # Query the database to get the order by ID
    order = Order.query.filter_by(id=order_id).first()

    if not order:
        return jsonify({'message': 'Order not found'}), 404

    # Update the order (example: set is_open based on the JSON data)
    # Assuming 'is_open' is a boolean value in the JSON
    is_open = data['is_open']
    order.is_open = is_open
    db.session.commit()

    return jsonify({'message': 'Order updated successfully'}), 200
