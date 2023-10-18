from dotenv import load_dotenv
import subprocess
from flask import Flask
from routes import order_blueprint
from models import db, init_app
from flask_migrate import Migrate
from check_order_changed import consume_messages
from apscheduler.schedulers.background import BackgroundScheduler
from flask_cors import CORS
import os
basedir = os.path.abspath(os.path.dirname(__file__))

load_dotenv()

app = Flask(__name__)

CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'secret')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + \
    os.path.join(basedir, os.getenv('DBNAME', 'order.db'))


app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.register_blueprint(order_blueprint)
init_app(app)
migrate = Migrate(app, db)

with app.app_context():
    db.create_all()


# scheduler = BackgroundScheduler()
# job = scheduler.add_job(consume_messages, 'interval', seconds=5, max_instances=2)

# scheduler.start()
if __name__ == "__main__":
    app.run(debug=True, port=os.getenv('APPPORT', 5002))
