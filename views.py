from flask import jsonify, render_template_string,render_template, request
from flask_security import auth_required,current_user,roles_accepted,SQLAlchemyUserDatastore
from flask_security.utils import hash_password
from extensions import db
from models import Professional,User

def create_view(app,userdatastore:SQLAlchemyUserDatastore):
    @app.route('/')
    def home():
        return render_template("index.html")
    
    @app.route('/register',methods=['POST'])
    def register():
        data= request.get_json()
        
        email=data.get('email')
        password=data.get('password')
        role=data.get('role')
        
        if not email or not password or role not in ['customer','professional']:
            return jsonify({"message":"Invalid data"})
        
        if userdatastore.find_user(email=email):
            return jsonify({"message":"User already exists"})
        
        #professional must be kept inactive until admin approves it
        if role=='professional':
            active=True #set false at end
        if role=='customer':    
            active=True
        
        try:
            user=userdatastore.create_user(email=email,password=hash_password(password),active=active,roles=[role])
                    
            db.session.add(user)
            if role=='professional':
                user=User.query.filter_by(email=email).first()
                professional=Professional(user_id=user.id,name='hi',phone='123',address='hi',pincode='123',service='hi',experience='hi')
                db.session.add(professional)
            if role=='customer':
                user=User.query.filter_by(email=email).first()
                customer=Professional(user_id=user.id,name='hi',phone='123',address='hi',pincode='123')
                db.session.add(customer)
            db.session.commit()
        except:
            print('Error creating user')
            db.session.rollback()
            return jsonify({"message":"Error creating user"}),408
        return jsonify({"message":"created user"}),200
            


    @app.route('/profile')
    @auth_required('session','token')
    #@auth_required('session','token','basic')
    def profile():
        return render_template_string("""
        <h1>Profile Page</h1>
        <p> Wlecome Mr. {{current_user.email}}</p>
        <a href="/logout">Logout</a> 
        """
        )
        
    @app.route('/customer')
    @roles_accepted('customer')
    def customers():
        return render_template_string("""
        <h1>Customer Page</h1>
        <p> Wlecome Mr. {{current_user.email}}</p>
        <a href="/logout">Logout</a> 
        """
        )