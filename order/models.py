from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def init_app(app):
    db.app = app
    db.init_app(app)


class Coffee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    is_open = db.Column(db.Boolean, default=True)

    def __init__(self, name, quantity, is_open=True):
        self.name = name
        self.quantity = quantity
        self.is_open = is_open


# class Order(db.Model):
    # __tablename__ = 'order'
    # id = db.Column(db.Integer, primary_key=True)
    # user_id = db.Column(db.Integer)
    # is_open = db.Column(db.Boolean, default=False)
    # order_items = db.relationship('OrderItem', backref="orderItem")

    # def serialize(self):
    # return {
    # 'user_id': self.user_id,
    # 'is_open': self.is_open,
    # 'order_items': [x.serialize() for x in self.order_items]
    # }


# class OrderItem(db.Model):
    # id = db.Column(db.Integer, primary_key=True)
    # order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
    # coffee_id = db.Column(db.Integer)
    # quantity = db.Column(db.Integer)

    # def __init__(self, coffee_id, quantity):
    # self.coffee_id = coffee_id
    # self.quantity = quantity

    # def serialize(self):
    # return {
    # 'coffee': self.coffee_id,
    # 'quantity': self.quantity
    # }
