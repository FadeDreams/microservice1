from models import db
from user import User

def seed_database(app):
    with app.app_context():
        # Your seed database logic here
        db.create_all()

        test_user = User(first_name='William',
                         last_name='Herschel',
                         email='t@x.com',
                         password='2')

        db.session.add(test_user)
        db.session.commit()

if __name__ == '__main__':
    from app import app
    seed_database(app)
