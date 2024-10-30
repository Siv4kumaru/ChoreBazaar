from celery import shared_task
import flask_excel as excel
import time
from models import ServiceRequest

@shared_task()
def lemon(x,y):
    time.sleep(10)
    return x+y

@shared_task(ignore_result=False)
def createCsv():
    req=ServiceRequest.query.with_entities(ServiceRequest.customerId,ServiceRequest.professionalId,ServiceRequest.serviceId,ServiceRequest.status).all()
    csv_out= excel.make_response_from_array(req,['customerId','professionalId','serviceId','status'],'csv')
    
    with open('./csv/requests.csv','wb') as f:
        f.write(csv_out.data)
    return 'reuests.csv'

     