from models import db, User
from flask_marshmallow import Marshmallow

ma = Marshmallow()

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'first_name', 'last_name', 'email', 'password')

user_schema = UserSchema()
users_schema = UserSchema(many=True)
    # planets_list = Planet.query.all()
    # result = planets_schema.dump(planets_list)

