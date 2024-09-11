from extensions import db
from flask_security import UserMixin, RoleMixin
from flask_security.models import fsqla_v3 as fsq

fsq.FsModels.set_db_info(db)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    active = db.Column(db.Boolean)
    fs_uniquifier = db.Column(db.String, nullable=False)

    # Removing 'lazy=dynamic' to allow eager loading
    roles = db.relationship('Role', secondary='user_roles', cascade="all, delete")
    
    professionals = db.relationship('Professional', cascade="all, delete", back_populates='user')
    customers = db.relationship('Customer', cascade="all, delete", back_populates='user')

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
    experience = db.Column(db.String)
   
    service = db.relationship('Service', back_populates='professionals')
    user = db.relationship('User', back_populates='professionals')
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
    professionalId=db.Column(db.Integer, db.ForeignKey('professional.id'))
    serviceId=db.Column(db.Integer, db.ForeignKey('service.id'))
    dateofrequest=db.Column(db.Date)
    dateofcompletion=db.Column(db.Date)
    serviceStatus=db.Column(db.String)
    feedback=db.Column(db.String)

    customer=db.relationship('Customer', back_populates='servicerequests')
    professional=db.relationship('Professional', back_populates='servicerequests')
    service=db.relationship('Service', back_populates='servicerequests')



    # @event.listens_for(Service, 'after_delete')
    # def update_professional_service_name(mapper, connection, target):
    #     # Update all professionals linked to the deleted service
    #     connection.execute(
    #         f"UPDATE professional SET serviceName = 'Deleted plz switch' WHERE serviceId = {target.id}"
    #     )