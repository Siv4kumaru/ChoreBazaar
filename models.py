from extensions import db
from flask_security import UserMixin, RoleMixin
from flask_security.models import fsqla_v3 as fsq

fsq.FsModels.set_db_info(db)

class User(db.Model,UserMixin):
    id=db.Column(db.Integer, primary_key=True)
    email=db.Column(db.String, unique=True,nullable=False)
    password=db.Column(db.String, nullable=False)
    active=db.Column(db.Boolean)
    fs_uniquifier=db.Column(db.String, nullable=False)
    roles=db.relationship('Role', secondary='user_roles')


class Role(db.Model,RoleMixin):
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(50), unique=True, nullable=False)
    description=db.Column(db.String)

class UserRoles(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'))
    role_id=db.Column(db.Integer, db.ForeignKey('role.id'))

class Professional(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    userId=db.Column(db.Integer, db.ForeignKey('user.id'))
    name=db.Column(db.String)
    phone=db.Column(db.String)
    address=db.Column(db.String)
    pincode=db.Column(db.String)
    service=db.Column(db.String)
    experience=db.Column(db.String)
    #pdf
    pro=db.relationship('User', backref='professional')

class Customer(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    userId=db.Column(db.Integer, db.ForeignKey('user.id'))
    name=db.Column(db.String)
    phone=db.Column(db.String)
    address=db.Column(db.String)    
    pincode=db.Column(db.String)
    cus=db.relationship('User', backref='customer')