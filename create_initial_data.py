# from flask_security import SQLAlchemyUserDatastore
# from flask_security.utils import hash_password
# from extensions import db


# def create_data(user_datastore:SQLAlchemyUserDatastore):
#     print("Creating initial data")
    
#     #create roles
#     admin=user_datastore.find_or_create_role(name='admin', description='Administrator')
#     customer=user_datastore.find_or_create_role(name='customer', description='Customer')
#     professional=user_datastore.find_or_create_role(name='professional', description='Professional')

#     #create users
#     if not user_datastore.find_user(email="admin@iitm.ac.in"):
#         user_datastore.create_user(email="admin@iitm.ac.in", password=hash_password("password"),active=True,roles=['admin'])
#     if not user_datastore.find_user(email="customer@iitm.ac.in"):
#         user_datastore.create_user(email="customer@iitm.ac.in", password=hash_password("password"),active=True,roles=['customer'])
#     if not user_datastore.find_user(email="profesional@iitm.ac.in"):
#         user_datastore.create_user(email="professional@iitm.ac.in", password=hash_password("password"),active=True,roles=['professional'])

#     db.session.commit()