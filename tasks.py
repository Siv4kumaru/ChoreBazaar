from celery import shared_task
from models import Service
from flask_excel import make_response_from_query_sets
from extensions import db
import time




@shared_task(ignore_result=False)
def csvtask():
    print("task startedd")
    serv=Service.query.with_entities(Service.name,Service.price).all()
    print(serv)
    csv_out=make_response_from_query_sets(serv,['name','price'],'csv')
    print(csv_out)
    filename='test.csv'
    
    with open(filename,'wb') as f:
        f.write(csv_out.data)
        
    return filename
    