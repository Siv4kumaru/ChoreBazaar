from extensions import db
from flask_security import UserMixin, RoleMixin
from flask_security.models import fsqla_v3 as fsq
from sqlalchemy import event, or_

fsq.FsModels.set_db_info(db)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    active = db.Column(db.Boolean)
    fs_uniquifier = db.Column(db.String, nullable=False)


    roles = db.relationship('Role', secondary='user_roles', cascade= "all, delete")
    roles = db.relationship('Role', secondary='user_roles')
    
    professionals = db.relationship('Professional', back_populates='user', cascade= "all, delete")
    customers = db.relationship('Customer', back_populates='user', cascade="all, delete")
    professionals = db.relationship('Professional', back_populates='user', cascade="all, delete-orphan")
    customers = db.relationship('Customer', back_populates='user',cascade="all, delete-orphan")

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String)

class UserRoles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"),unique=True)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))

class Professional(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"),unique=True)
    name = db.Column(db.String)
    phone = db.Column(db.String)
    address = db.Column(db.String)
    pincode = db.Column(db.String)
    serviceId = db.Column(db.Integer, db.ForeignKey('service.id', ondelete='SET NULL'), nullable=True)
    serviceName = db.Column(db.String)    
    experience = db.Column(db.Integer)
   
    service = db.relationship('Service', back_populates='professionals')
    user = db.relationship('User', back_populates='professionals', single_parent=True)
    servicerequests = db.relationship('ServiceRequest', back_populates='professional')

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer,db.ForeignKey('user.id', ondelete="CASCADE"),unique=True)
    name = db.Column(db.String)
    phone = db.Column(db.String)
    address = db.Column(db.String)
    pincode = db.Column(db.String)

    servicerequests = db.relationship('ServiceRequest', back_populates='customer')
    user = db.relationship('User', back_populates='customers')

class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String,unique=True)
    description = db.Column(db.String)
    price = db.Column(db.Float)

    professionals = db.relationship('Professional', back_populates='service')
    servicerequests = db.relationship('ServiceRequest', back_populates='service')

class ServiceRequest(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    customerId=db.Column(db.Integer, db.ForeignKey('customer.id'))
    #if customer is deleted/blocked, it will be set to NULL and servicestatus will be set to "customer blocked"
    professionalId=db.Column(db.Integer, db.ForeignKey('professional.id'))
    #if pro is deleted/blocked, it will be set to NULL and servicestatus will be set to "Profssional Blocked"
    customerId=db.Column(db.Integer, db.ForeignKey('customer.id',ondelete="SET NULL"))
    #if customer is deleted/blocked, it will be set to NULL and servicestatus will be set to "customer blocked"
    professionalId=db.Column(db.Integer, db.ForeignKey('professional.id',ondelete="SET NULL"))
    #if pro is deleted/blocked, it will be set to NULL and servicestatus will be set to "Profssional Blocked"
    serviceId=db.Column(db.Integer, db.ForeignKey('service.id', ondelete="SET NULL"))
    #if servieID is deleted /blocked, it will be set to NULL and servicestatus will be set to "cancelled request (by admin)"
    approve=db.Column(db.String, default="Pending")
    dateofrequest=db.Column(db.String)
    dateofcompletion=db.Column(db.String)
    serviceStatus=db.Column(db.String,default="Pending")
    feedback=db.Column(db.String)

    customer=db.relationship('Customer', back_populates='servicerequests')
    professional=db.relationship('Professional', back_populates='servicerequests')
    service = db.relationship('Service', back_populates='servicerequests')  

#to trigger this use db.seession.commit()
@event.listens_for(ServiceRequest, 'before_insert')
@event.listens_for(ServiceRequest, 'before_update')
def set_service_status(mapper, connection, target):
    if target.serviceId is None :
        target.serviceStatus += "<Service Deleted>"


      
