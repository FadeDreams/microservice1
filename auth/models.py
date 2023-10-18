from flask_sqlalchemy import SQLAlchemy
# from app import app
db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String)

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            # Add other attributes you want to include
        }
# @app.cli.command('db_create')
# def db_create():
    # db.create_all()
    # print('Database created!')

# @app.cli.command('db_drop')
# def db_drop():
    # db.drop_all()
    # print('Database dropped!')

# @app.cli.command('db_seed')
# def db_seed():
    # test_user = User(first_name='William',
        # last_name='Herschel',
        # email='t@t.com',
        # password='2')

    # db.session.add(test_user)
    # db.session.commit()
    # print('Database seeded!')
