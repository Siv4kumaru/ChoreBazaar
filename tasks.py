from celery import shared_task
from models import Service,User,Professional,ServiceRequest,Customer
from jinja2 import Template
from mail import send_message
from flask_excel import make_response_from_query_sets
from extensions import db
import time
from datetime import datetime




@shared_task(ignore_result=False)
def csvtask():
    req = ServiceRequest.query.with_entities(
        ServiceRequest.id,
        ServiceRequest.customerId,
        ServiceRequest.professionalId,
        ServiceRequest.serviceId,
        ServiceRequest.dateofrequest,
        ServiceRequest.dateofcompletion,
        ServiceRequest.serviceStatus,
        ServiceRequest.feedback
    ).all()

# Corrected column headers for the ServiceRequest table
    csv_out = make_response_from_query_sets(
    req,
    ['id', 'customerId', 'professionalId', 'serviceId', 'serviceStatus', 'feedback'],
    'csv')

    filename='ALLServiceRequests.csv'
    
    with open(filename,'wb') as f:
        f.write(csv_out.data)
        
    return filename

@shared_task(ignore_result=False)
def monthlyReport():
    req=ServiceRequest.query.all()
    Status={}
    for i in req:
        pid=i.professionalId
        userid=Professional.query.filter_by(id=pid).first().userId
        pro_email=User.query.filter_by(id=userid).first().email
        pro_name=Professional.query.filter_by(id=pid).first().name
        
        cid=i.customerId
        usercustid=Customer.query.filter_by(id=cid).first().userId
        cust_email=User.query.filter_by(id=usercustid).first().email
        cust_name=Customer.query.filter_by(id=cid).first().name  
        
        service=Service.query.filter_by(id=i.serviceId).first().name
        
        
        if i.approve in Status :
            Status[i.approve].append({"customer":cust_name,"professional":pro_name,"customerEmail":cust_email,"professionalEmail":pro_email,"service":service,"date":i.dateofrequest,"doc":i.dateofcompletion})
        else:
            Status[i.approve]=[]
            Status[i.approve].append({"customer":cust_name,"professional":pro_name,"customerEmail":cust_email,"professionalEmail":pro_email,"service":service,"date":i.dateofrequest,"doc":i.dateofcompletion})
        if i.serviceStatus in Status:
            Status[i.serviceStatus].append({"customer":cust_name,"customerEmail":cust_email,"professionalEmail":pro_email,"professional":pro_name,"service":service,"date":i.dateofrequest,"doc":i.dateofcompletion})
        else:
            Status[i.serviceStatus]=[]
            Status[i.serviceStatus].append({"customer":cust_name,"customerEmail":cust_email,"professionalEmail":pro_email,"professional":pro_name,"service":service,"date":i.dateofrequest,"doc":i.dateofcompletion})

    with open('MonthlyReport.html', 'r') as f:
        template = Template(f.read())

        send_message('admin@gmail.com', "Monthly Report",
                        template.render( data=Status))

        
        
    # roleuserID=UserRoles.query.filter_by(UserRoles.role_id==1).user_id.all()
    # users = User.query.filter_by(User.user_id==roleuserID).all()

@shared_task(ignore_result=False)
def daily_reminder():

    req=ServiceRequest.query.filter_by(approve='Pending').all()
    for r in req:
        pid=r.professionalId
        userid=Professional.query.filter_by(id=pid).first().userId
        receiver_email=User.query.filter_by(id=userid).first().email
        name=Professional.query.filter_by(id=pid).first().name
        with open('email.html', 'r') as f:
            template = Template(f.read())
            send_message(receiver_email, "Pending Requests Reminder",
                            template.render( name=name))
        
    # roleuserID=UserRoles.query.filter_by(UserRoles.role_id==1).user_id.all()
    # users = User.query.filter_by(User.user_id==roleuserID).all()

