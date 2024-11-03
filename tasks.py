from celery import shared_task
from models import Service,User,UserRoles
from jinja2 import Template
from mail import send_message
from flask_excel import make_response_from_query_sets
from extensions import db
import time




@shared_task(ignore_result=False)
def csvtask():
    serv=Service.query.with_entities(Service.name,Service.price).all()
    csv_out=make_response_from_query_sets(serv,['name','price'],'csv')
    filename='test.csv'
    
    with open(filename,'wb') as f:
        f.write(csv_out.data)
        
    return filename

@shared_task(ignore_result=False)
def daily_reminder(to, subject):
    send_message(to, subject, "This is a daily reminder")
    print("sent")
    # roleuserID=UserRoles.query.filter_by(UserRoles.role_id==1).user_id.all()
    # users = User.query.filter_by(User.user_id==roleuserID).all()
    # print(users.email)
    # for user in users:
    #     with open('test.html', 'r') as f:
    #         template = Template(f.read())
    #         send_message(user.email, subject,
    #                      template.render(email=user.email))
    return "OK"
    