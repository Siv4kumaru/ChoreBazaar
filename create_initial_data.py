from flask_security import SQLAlchemyUserDatastore
from flask_security.utils import hash_password
from extensions import db
from models import Customer,Professional,Service,ServiceRequest


def create_data(user_datastore:SQLAlchemyUserDatastore):
    print("Creating initial data")
    
    #create roles
    admin=user_datastore.find_or_create_role(name='admin', description='Administrator')
    customer=user_datastore.find_or_create_role(name='customer', description='Customer')
    professional=user_datastore.find_or_create_role(name='professional', description='Professional')

    #create users
    if not user_datastore.find_user(email="admin@gmail.com"):
        user_datastore.create_user(email="admin@gmail.com", password=hash_password("password"),active=True,roles=['admin'])
    if not user_datastore.find_user(email="cust@gmail.com"):
        user_datastore.create_user(email="cust@gmail.com", password=hash_password("password"),active=True,roles=['customer'])
        user=user_datastore.find_user(email="cust@gmail.com")
        customer=Customer(userId=user.id,name="cust",phone="1234567890",address="Bezulla Road, Tnagar, Chennai, TamilNadu",pincode="620014")
        db.session.add(customer)
    if not user_datastore.find_user(email="pro@gmail.com"):
        user_datastore.create_user(email="pro@gmail.com", password=hash_password("password"),active=True,roles=['professional'])
        user=user_datastore.find_user(email="pro@gmail.com")
        professional=Professional(userId=user.id,name="pro",phone="123",serviceName="AC Mechanic",serviceId=1,address="ChromePet , Chennai, TamilNadu",pincode="620014",experience="12")
        db.session.add(professional)

    if not Service.query.filter_by(name="AC Mechanic").first():
        ac_mechanic=Service(name="AC Mechanic",description="AC Mechanic",price=1000)
        db.session.add(ac_mechanic)

    if not ServiceRequest.query.filter_by(id=1).first():
        service_request=ServiceRequest(customerId=1,professionalId=1,serviceId=1,dateofrequest="2024-02-02",dateofcompletion="2024-02-02",serviceStatus="completed",feedback="good")
        db.session.add(service_request)





    db.session.commit()