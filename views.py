from flask import jsonify, render_template_string,render_template, request,send_file
from flask_security import auth_required,current_user,roles_accepted,SQLAlchemyUserDatastore
from flask_security.utils import hash_password,verify_password
from extensions import db
from datetime import datetime
from models import Professional,User,Customer,Service,ServiceRequest
from tasks import csvtask
from celery.result import AsyncResult
import flask_excel as excel
from werkzeug.utils import secure_filename
import os

def create_view(app,userdatastore:SQLAlchemyUserDatastore,cache):
    
    #celery
    @app.get('/csv')
    def csvDown():
        res=csvtask.delay()
        return jsonify({"task_id":res.id})
    
    @app.get('/get_csv/<task_id>')
    def get_csv(task_id):
        res=AsyncResult(task_id)
        if res.ready():
            filename=res.result
            return send_file(filename,as_attachment=True)
        else:
            return jsonify({"task_status":res.status}),404
    
    @app.route('/get_task/<task_id>')
    def get_task(task_id):
        result=AsyncResult(task_id)
        if result.ready():
            return jsonify({"task_status":result.status,"result":result.get()})
        else:
            return jsonify({"task_status":result.status}),404
    
    #wanna see changes in cache ctrl+c in cmd and flask run again
    @app.route('/cacheDemo')   
    @cache.cached(timeout=10)
    def cacheDemo():
        return {"time":datetime.now()}
    
    @app.route('/')
    def home():
        return render_template('index.html')
    
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
            
            return jsonify({"message":"Admin is curently reviewing your credentials , kindly wait fro few days"}),404


        if verify_password(password,user.password):
            return jsonify({"token": user.get_auth_token(),"role":user.roles[0].name,"id":user.id,email:user.email}),200
        else:
            return jsonify({"message":"Invalid password"}),404
        



    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the upload directory exists
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    ALLOWED_EXTENSIONS = {'pdf'}
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB limit

    def allowed_file(file):
        return file and file.filename.endswith('.pdf') and file.content_length <= MAX_FILE_SIZE

    @app.route('/register', methods=['POST'])
    def register():
        data = request.form.to_dict()  # Use form data for non-JSON form submission
        pdf_file = request.files.get('pdfDocument')  # Get file from form
    
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        
        # Validation checks
        if role == 'admin':
            return jsonify({"message": "Not today Hacker, I'm the only Admin"}), 404

        if not email or not password or role not in ['customer', 'professional']:
            return jsonify({"message": "Invalid data"}), 404
        
        if userdatastore.find_user(email=email):
            return jsonify({"message": "User already exists"}), 404

        # Set user activation based on role
        active = role == 'customer'

        try:
            # Create user
            user = userdatastore.create_user(email=email, password=hash_password(password), active=active, roles=[role])
            db.session.add(user)

            # Additional data
            name = data.get('name')
            phone = data.get('phone')
            address = data.get('address')
            pincode = data.get('pincode')

            if role == 'professional':
                serviceName = data.get('service')
                experience = data.get('experience')

                # Check if service exists
                service = Service.query.filter_by(name=serviceName).first()
                if service is None:
                    return jsonify({"message": "Service not found"}), 404
                
                # Handle PDF file upload
                if pdf_file and allowed_file(pdf_file):
                    filename = secure_filename(email + '.pdf')
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    pdf_file.save(file_path)  # Save the file to the upload folder

                    # Create Professional entry with file path
                    professional = Professional(
                        userId=user.id, 
                        serviceId=service.id,
                        name=name,
                        phone=phone,
                        address=address,
                        pincode=pincode,
                        serviceName=serviceName,
                        experience=experience,
                        pdf_path=file_path  # Store the file path in the database
                    )
                    db.session.add(professional)
                else:
                    return jsonify({"message": "PDF is missing, invalid, or too large"}), 400

            elif role == 'customer':
                # Create Customer entry
                customer = Customer(userId=user.id, name=name, phone=phone, address=address, pincode=pincode)
                db.session.add(customer)

            db.session.commit()
            return jsonify({"message": "User created successfully"}), 200
        except Exception as e:
            print(f"Error creating user: {e}")
            db.session.rollback()
            return jsonify({"message": "Error creating user"}), 500
                

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
    @app.route('/download_pdf/<email>', methods=['GET'])
    def download_pdf(email):
        # Query the Professional user by their ID
        user=userdatastore.find_user(email=email)
        professional=Professional.query.filter_by(userId=user.id).first()
        if professional and professional.pdf_path:
            try:
                # Serve the file from the saved path
                return send_file(professional.pdf_path, as_attachment=True)
            except Exception as e:
                print(f"Error sending file: {e}")
                return jsonify({"message": "Error downloading file"}), 500
        else:
            return jsonify({"message": "File not found"}), 404
    
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