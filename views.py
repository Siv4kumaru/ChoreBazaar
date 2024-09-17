from flask import jsonify, render_template_string,render_template, request
from flask_security import auth_required,current_user,roles_accepted,SQLAlchemyUserDatastore
from flask_security.utils import hash_password,verify_password
from extensions import db
from models import Professional,User,Customer,Service,ServiceRequest

def create_view(app,userdatastore:SQLAlchemyUserDatastore):
    @app.route('/')
    def home():
        return render_template("index.html")
    
    @app.route('/userLogin',methods=['POST'])
    def userLogin():
        data =request.get_json()
        email=data.get('email')
        password=data.get('password')

        if not email:
            return jsonify({"message":"Email is required"}),404
        if not password:
            return jsonify({"message":"Password is required"}),404
        
        user=userdatastore.find_user(email=email)

        if not user:
            return jsonify({"message":"User not found"}),404
        if not user.active:
            return jsonify({"message":"user is flagged, kindly contact the admin"}),404

        if verify_password(password,user.password):
            return jsonify({"token": user.get_auth_token(),"role":user.roles[0].name,"id":user.id,email:user.email}),200


    @app.route('/register',methods=['POST'])
    def register():
        data= request.get_json()
        
        email=data.get('email')
        password=data.get('password')
        role=data.get('role')
        
        if role=='admin':
            return jsonify({"message":"Not today Hacker, I'm the only Admin"})
        
        if not email or not password or role not in ['customer','professional']:
            return jsonify({"message":"Invalid data"})
        
        if userdatastore.find_user(email=email):
            return jsonify({"message":"User already exists"})
        
        #professional must be kept inactive until admin approves it
        if role=='professional':
            active=False #set false at end
        if role=='customer':    
            active=True
        
        try:
            user=userdatastore.create_user(email=email,password=hash_password(password),active=active,roles=[role])
                    
            db.session.add(user)
            if role=='professional':
                name=data.get('name')
                phone=data.get('phone')
                address=data.get('address')
                pincode=data.get('pincode')
                serviceName=data.get('service')
                experience=data.get('experience')
                useru=User.query.filter_by(email=email).first()
                service=Service.query.filter_by(name=serviceName).first()
                if service is None:
                    return jsonify({"message":"Service not found"}),404
                professional=Professional(userId=useru.id,serviceId=service.id,name=name,phone=phone,address=address,pincode=pincode,serviceName=serviceName,experience=experience)
                db.session.add(professional)
            if role=='customer':
                name=data.get('name')
                phone=data.get('phone')
                address=data.get('address')
                pincode=data.get('pincode')
                useru=User.query.filter_by(email=email).first()
                customer=Customer(userId=useru.id,name=name,phone=phone,address=address,pincode=pincode)
                db.session.add(customer)
            db.session.commit()
        except:
            print('Error creating user')
            db.session.rollback()
            return jsonify({"message":"Error creating user"}),408
        return jsonify({"message":"created user"}),200
            

    @app.route('/dropdownService', methods=['GET'])
    def dropdown_services():
        services = Service.query.all()
        service_list = [{'id': service.id, 'name': service.name} for service in services]
        return jsonify(service_list)


    @app.route('/customerDashboard')
    @roles_accepted('customer')
    def customer():
        return render_template_string("""
        <h1>Customer Page</h1>
        <p> Wlecome Mr.{{current_user.email}}</p>
        <a href="/logout">Logout</a> 
        """
        )
        

        
        
    @app.route('/activate/<id>',methods=['GET'])
    @roles_accepted('admin')
    def activate(id):
        user=userdatastore.find_user(id=id)
        if not user:
            return jsonify({"message":"user not found"}),400
        if(user.active==True):
            return jsonify({"message":f"user:{user.email} already activated"}),400
        
        user.active=True
        db.session.commit()
        return jsonify({"message":f"user {user.email} is activated"}),200
    
    @roles_accepted('admin')
    @app.route('/deactivate/<id>',methods=['GET'])
    def deactivate(id):
        user=userdatastore.find_user(id=id)
        if not user:
            return jsonify({"message":"user not found"}),400
        if(user.active==False):
            return jsonify({"message":f"user:{user.email} already deactivated"}),400
        
        user.active=False
        db.session.commit()
        return jsonify({"message":f"user {user.email} is deactivated"}),200
    
    @roles_accepted('admin')
    @app.route('/inactivePro',methods=['GET'])
    def inactivePro():
        users=User.query.filter_by(active=False).all()
        inactiveUsers=[{'id':user.id,'email':user.email} for user in users]
        return jsonify(inactiveUsers),200