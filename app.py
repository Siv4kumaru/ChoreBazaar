from flask import Flask
import views
import Sauce as Sauce
from extensions import db,security,cache
from flask_caching import Cache
from create_initial_data import create_data
from worker import celery_init_app  
from celery.schedules import crontab
from tasks import daily_reminder
import flask_excel as excel


def create_app():
    app = Flask(__name__)
 
    app.config['SECRET_KEY'] = "abcd"
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
    app.config['SECURITY_PASSWORD_SALT'] = 'salt_in_your_eyes'
    
    #config for de token
    app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] = 'Authentication-Token' 
    app.config['SECURITY_TOKEN_MAX_AGE'] = 3600
    app.config['SECURITY_LOGIN_WITHOUT_CONFIRMATION'] = True #diff token evrytime 
    
    #cache
    app.config["CACHE_DEFAULT_TIMEOUT"] = 300 #after 300 ms the cache will be deleted
    app.config["DEBUG"] = True
    app.config["CACHE_TYPE"] = "RedisCache"
    app.config["CACHE_REDIS_PORT"] = 6379 
    #app.config['CACHE_REDIS_HOST'] = 'localhost'

    
    cache.init_app(app)
    db.init_app(app)
    excel.init_excel(app)    

    with app.app_context():
        from models import User, Role
        from flask_security import SQLAlchemyUserDatastore

        user_datastore = SQLAlchemyUserDatastore(db, User, Role)
        security.init_app(app, user_datastore)
        db.create_all()
        create_data(user_datastore)

    app.config['WTF_CSRF_CHECK_DEFAULT'] = False
    app.config['SECURITY_CSRF_PROTECT_MECHANISMS'] = []
    app.config['SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS'] = True
    


    views.create_view(app,user_datastore,cache)
    
    #resouces
    Sauce.api.init_app(app)

    return app


app=create_app()
celery_app = celery_init_app(app)

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=14, minute=59,day_of_week='*'),
        daily_reminder.s('dummyrecievetriple777@gmail.com', 'Daily Test'),
    )

if __name__ == '__main__':
    app.run(debug=True)