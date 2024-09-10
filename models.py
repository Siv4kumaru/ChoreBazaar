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
    service = db.Column(db.String)
    experience = db.Column(db.String)

    user = db.relationship('User', back_populates='professionals')

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer,db.ForeignKey('user.id', ondelete="CASCADE"),unique=True)
    name = db.Column(db.String)
    phone = db.Column(db.String)
    address = db.Column(db.String)
    pincode = db.Column(db.String)


    user = db.relationship('User', back_populates='customers')
