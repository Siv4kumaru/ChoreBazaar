from flask_restful import marshal_with,Resource,Api,fields,reqparse
from flask_security import auth_required,roles_accepted
from models import User,UserRoles,Service,ServiceRequest,Customer,Professional
from flask_security.utils import hash_password,verify_password
import logging
from extensions import db,cache
from datetime import datetime


api=Api(prefix='/api')
#marshelling

parser  = reqparse.RequestParser() #convert data to json
parser.add_argument('name',type=str,required=True)
parser.add_argument('description',type=str,required=True)
parser.add_argument('price',type=float,required=True)

#del is common for all
delParser=reqparse.RequestParser()
delParser.add_argument('id',type=int,required=True)

patchParser=reqparse.RequestParser()
patchParser.add_argument('id',type=int,required=True)
patchParser.add_argument('name',type=str)
patchParser.add_argument('description',type=str)
patchParser.add_argument('price',type=float)
patchParser.add_argument('approve',type=str)

service_fields={
    'id':fields.Integer,
    'name':fields.String,
    'description':fields.String,
    'price':fields.Float,
}
request_fields={
    'id':fields.Integer,
    'customerId':fields.Integer,
    'professionalId':fields.Integer,
    'serviceId':fields.Integer,
    'dateofrequest':fields.String,
    'dateofcompletion':fields.String,
    'serviceStatus':fields.String,
    'feedback':fields.String,
}

reqPostparser = reqparse.RequestParser()
reqPostparser.add_argument('customerId', type=int, required=True)
reqPostparser.add_argument('proUserId', type=int, required=True)
reqPostparser.add_argument('serviceId', type=int, required=True)
reqPostparser.add_argument('dateofrequest', type=str)
reqPostparser.add_argument('dateofcompletion', type=str)
reqPostparser.add_argument('serviceStatus', type=str)
reqPostparser.add_argument('feedback', type=str)


reqPatchparser = reqparse.RequestParser()
reqPatchparser.add_argument('id', type=int, required=True)
reqPatchparser.add_argument('custEmail', type=str)
reqPatchparser.add_argument('proEmail', type=str)
reqPatchparser.add_argument('serviceStatus', type=str)
reqPatchparser.add_argument('dateofcompletion', type=str)
reqPatchparser.add_argument('dateofrequest', type=str)
reqPatchparser.add_argument('serviceStatus', type=str)
reqPatchparser.add_argument('approve', type=str)
reqPatchparser.add_argument('feedback', type=str)
reqPatchparser.add_argument('rating', type=int)

custPatch = reqparse.RequestParser()
custPatch.add_argument('id',type=int,required=True)
custPatch.add_argument('active',type=bool)

class BlockUserResource(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        userroles=UserRoles.query.filter_by(user_id=id).first().role_id
        if userroles == 1 :
            return {"message": f"{user.email} is an admin  "}, 212
        if not user:
            return {"message": "User not found"}, 214
        if not user.active:
            return {"message": f"User {user.email} is already blocked"}, 210
        
        user.active = False
        db.session.commit()
        return {"message": f"User {user.email} has been blocked"}, 200

api.add_resource(BlockUserResource, '/block/<int:id>')

class UnBlockUserResource(Resource):
    @roles_accepted('admin')
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        userroles=UserRoles.query.filter_by(user_id=id).first().role_id
        if userroles == 1 :
            return {"message": f"{user.email} is an admin"}, 212
        if not user:
            return {"message": "User not found"}, 210
        if user.active:
            return {"message": f"User {user.email} is already not blocked"}, 213
        
        user.active = True
        db.session.commit()
        return {"message": f"User {user.email} has been Unblocked"}, 200

api.add_resource(UnBlockUserResource, '/unblock/<int:id>')

custpatch=reqparse.RequestParser()
custpatch.add_argument('email',type=str)
custpatch.add_argument('name',type=str)
custpatch.add_argument('phone',type=str)
custpatch.add_argument('address',type=str)
custpatch.add_argument('pincode',type=int)

class CustomerSauce(Resource):
    @auth_required('token')
    @roles_accepted('admin','customer')
    @cache.cached(timeout=10, key_prefix='cust')
    def get(self):
        list=[]
        customer=Customer.query.all()
        if customer is None :
            return {"message":"No Customer Left"},404
        for cus in customer:
            user=User.query.filter_by(id=cus.userId).first()
            list.append({"id":user.id,"name":cus.name,"email":user.email,"phone":cus.phone,"address":cus.address,"pincode":cus.pincode,"active":user.active})
        return list,200
    def patch(self):
        args=custpatch.parse_args()
        userId=User.query.filter_by(email=args['email']).first().id
        customer=Customer.query.filter_by(userId=userId).first()
        if customer is None:
            return {"message":"Customer not found"},404
        if args.get('name'):
            customer.name=args['name']
        if args.get('phone'):
            customer.phone=args['phone']
        if args.get('address'):
            customer.address=args['address']
        if args.get('pincode'):
            customer.pincode=args['pincode']
        db.session.commit()
        cache.delete('cust')
        return {"message":"Customer Updated"},200

propatch=reqparse.RequestParser()
propatch.add_argument('email',type=str)
propatch.add_argument('name',type=str)
propatch.add_argument('phone',type=str)
propatch.add_argument('address',type=str)
propatch.add_argument('pincode',type=int)
propatch.add_argument('experience',type=str)

class ProfessionalSauce(Resource):
    @auth_required('token')
    @roles_accepted('admin','customer','professional')
    @cache.cached(timeout=10, key_prefix='pro')
    def get(self):
        list=[]
        pro=Professional.query.all()
        if pro is None :
            return {"message":"No Pro Left"},404
        for p in pro:
            user=User.query.filter_by(id=p.userId).first()
            serv=Service.query.filter_by(id=p.serviceId).first()
            if serv is None:
                servicePrice="Service Not Found"
            else:
                servicePrice=serv.price
            list.append({"proid":p.id,"proUserId":user.id,"name":p.name,"servicePrice":servicePrice,"email":user.email,"phone":p.phone,"address":p.address,"pincode":p.pincode,"serviceName":p.serviceName,"serviceId":p.serviceId,"experience":p.experience,"active":user.active})
        return list,200
    
    @auth_required('token')
    @roles_accepted('admin','customer','professional')
    def patch(self):
        args=propatch.parse_args()
        userId=User.query.filter_by(email=args['email']).first().id
        pro=Professional.query.filter_by(userId=userId).first()
        if pro is None:
            return {"message":"Professional not found"},404
        if args.get('name'):
            pro.name=args['name']
        if args.get('phone'):
            pro.phone=args['phone']
        if args.get('address'):
            pro.address=args['address']
        if args.get('pincode'):
            pro.pincode=args['pincode']
        if args.get('experience'):
            pro.experience=args['experience']
        db.session.commit()
        cache.delete('pro')
        return {"message":"Professional Updated"},200   

class ProfessionalNameSauce(Resource):
    @auth_required('token')
    @roles_accepted('admin','customer')
    def get(self,email):
        user=User.query.filter_by(email=email).first()
        if user is None:
            return {"message":"User not found"},404
        return {"name":Professional.query.filter_by(userId=user.id).first().name},200

api.add_resource(ProfessionalNameSauce,'/professional/<string:email>')
    
class requestSauce(Resource):
    @auth_required('token')
    @roles_accepted('admin','customer','professional')
    @cache.cached(timeout=10, key_prefix='requests')
    def get(self):
        list=[]
        requests=ServiceRequest.query.all()
        
        if requests is None:
            return {"message":"No Requests"},404
        for req in requests:
            customeruser=Customer.query.filter_by(id=req.customerId).first()
            if customeruser is None:
                logging.error("Customer does not exist")
                return {"message": "Customer does not exist"}, 400
            customeruserid=customeruser.userId
            customername=customeruser.name
            prouser=Professional.query.filter_by(id=req.professionalId).first().userId
            if prouser is None:
                logging.error("Professional does not exist")
                return {"message": "Professional does not exist"}, 400
            prouserid=prouser
            custemail=User.query.filter_by(id=customeruserid).first().email
            proemail=User.query.filter_by(id=prouserid).first().email
            service=Service.query.filter_by(id=req.serviceId).first()
            if service is None:
                serviceName="Service Not Found"
                servicePrice=-1
            else:
                serviceName=service.name
                servicePrice=service.price
            requ={"id":req.id,"customerName":customername,"custemail":custemail,"proemail":proemail,"serviceName":serviceName,"servicePrice":servicePrice,"approve":req.approve,"dateofrequest":req.dateofrequest,"dateofcompletion":req.dateofcompletion,"serviceStatus":req.serviceStatus,"feedback":req.feedback,"approve":req.approve}  
            list.append(requ)
        return list,200

    @auth_required('token')
    @roles_accepted('customer') 
    def post(self):
        args = reqPostparser.parse_args()

        # Check if customer exists
        customer = User.query.filter_by(id=args['customerId']).first()
        if not customer:
            logging.error(f"Customer with ID {args['customerId']} does not exist.")
            return {"message": "Customer does not exist"}, 400

        # Check if professional exists
        pro = Professional.query.filter_by(userId=args['proUserId']).first()
        if not pro:
            logging.error(f"Professional with User ID {args['proUserId']} does not exist.")
            return {"message": "Professional does not exist"}, 400

        # Check if service exists
        service = Service.query.filter_by(id=args.get('serviceId')).first()
        if not service:
            logging.error(f"Service with ID {args['serviceId']} does not exist.")
            return {"message": "Service does not exist"}, 407

        # Check if there's an existing request
        existing_request = ServiceRequest.query.filter_by(
            customerId=args['customerId'],
            professionalId=pro.id,
            serviceId=args['serviceId']
        ).all()

        for request in existing_request:
            if request.approve == "Pending":
                return {"message": "Request approval by pro is pending."}, 400
            if request.approve == "customer Cancellation":
                return {"message": "Wait"}, 400     
        now = datetime.now()

# Format the date, hour, and minutes
        formatted_time = now.strftime("%Y-%m-%d %H:%M")
        # Create a new request
        new_request = ServiceRequest(
            customerId=args['customerId'],
            professionalId=pro.id,
            serviceId=args['serviceId'],
            dateofrequest=formatted_time,
            dateofcompletion=args['dateofcompletion'],
            serviceStatus="Pending",
            feedback=args['feedback']
        )
        
        db.session.add(new_request)
        db.session.commit()
        cache.delete('requests')

        logging.info(f"Service request created successfully for customer ID {args['customerId']}.")
        return {"message": "Request created"}, 200

    
    @auth_required('token')
    @roles_accepted('admin')
    def delete(self):
        args=delParser.parse_args()
        request=ServiceRequest.query.filter_by(id=args['id']).first()
        if request is None:
            return {"message":"Request not found"},404
        db.session.delete(request)
        db.session.commit()
        return {"message":"Request Deleted"},200
    
    @auth_required('token')
    @roles_accepted('admin','customer','professional')
    def patch(self):
        args=reqPatchparser.parse_args()
        request=ServiceRequest.query.filter_by(id=args['id']).first()

        if request is None:
            return {"message":"Request not found"},404

        if args.get('custEmail') and User.query.filter_by(email=args['custEmail']).first() is None:
            return {"message":"Customer does not exist"},400
        
        if args.get('proEmail') and User.query.filter_by(email=args['proEmail']).first() is None:
            return {"message":"Professional does not exist"},400
        
        if args.get('serviceName') and Service.query.filter_by(name=args['serviceName']).first() is None:
            return {"message":"Service does not exist"},400

        if args.get('custEmail'):
            custid=Customer.query.filter_by(userId=User.query.filter_by(email=args['custEmail']).first().id).first().id
            request.customerId = custid

        if args.get('proEmail'):
            proid=Professional.query.filter_by(userId=User.query.filter_by(email=args['proEmail']).first().id).first().id
            request.professionalId = proid
            
        if args.get('serviceName'):
            serid=Service.query.filter_by(name=args['serviceName']).first().id
            request.serviceId = serid
        
        if args.get('serviceStatus'):
            request.serviceStatus = args['serviceStatus']

        if args.get('feedback'):
            request.feedback = args['feedback']

        if args.get('rating'):
            request.rating = args['rating']

        if args.get('dateofrequest'):
            request.dateofrequest = args['dateofrequest']
        
        if args.get('dateofcompletion'):
            request.dateofcompletion = args['dateofcompletion']
            
        if args.get('approve'):
            request.approve = args['approve']

        db.session.commit()
        cache.delete('requests')
        return {"message":f"Request Updated"},200
    


class ServiceSauce(Resource):
    # @auth_required()
    # @roles_accepted('admin')
    @marshal_with(service_fields)
    @cache.cached(timeout=10, key_prefix='service')
    def get(self):
        allServices=Service.query.all()
        return allServices

    
    @auth_required('token')
    @roles_accepted('admin')
    def post(self):
        args=parser.parse_args()
        if Service.query.filter_by(name=args['name']).first() is not None:
            return {"message":"Service already exists"},400
        service=Service(**args)
        db.session.add(service)
        db.session.commit()
        cache.delete('service')
        return {"message":"Service Created"},200
    
    @auth_required('token')
    @roles_accepted('admin')
    def delete(self): 
        args=delParser.parse_args()
        service=Service.query.filter_by(id=args['id']).first()
        if service is None:
            return {"message":"Service not found"},404
        db.session.delete(service)
        db.session.commit()
        cache.delete('service')
        return {"message":"Service Deleted"},200
    
    @auth_required('token')
    @roles_accepted('admin')
    def patch(self):
        args=patchParser.parse_args()
        service=Service.query.filter_by(id=args['id']).first()
        if service is None:
            return {"message":"Service not found"},404
        if Service.query.filter_by(name=args['name']).first() is not None and service.name != args['name']:
            return {"message":"Service already exists"},400
        if args.get('name'):
            service.name = args['name']

        if args.get('description'):
            service.description = args['description']

        if args.get('price') is not None:
            service.price = args['price']
        db.session.commit()
        cache.delete('service')
        return {"message":"Service Updated"},200
    
class ServiceIdSauce(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    def get(self,id):
        service=Service.query.filter_by(id=id).first()
        if service is None:
            return {"message":"Service not found"},404
        return {"id":service.id,"name":service.name,"description":service.description,"price":service.price},200
    
class RequestIdsauce(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    def get(dself,id):
        request=ServiceRequest.query.filter_by(id=id).first()
        if request is None:
            return {"message":"Request not found"},404
        service=Service.query.filter_by(id=request.serviceId).first()
        if service is None:
            serviceName="Service Not Found"
        else:
            serviceName=service.name
        customeremail=User.query.filter_by(id=Customer.query.filter_by(id=request.customerId).first().userId).first().email
        proemail=User.query.filter_by(id=Professional.query.filter_by(id=request.professionalId).first().userId).first().email
        return {"id":request.id,"custEmail":customeremail,"proEmail":proemail,"serviceName":serviceName,"dateofrequest":request.dateofrequest,"dateofcompletion":request.dateofcompletion,"serviceStatus":request.serviceStatus,"feedback":request.feedback},200


 
class searchall(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    def get(self,searchType):
        listu=[]
        if searchType=="service":
            service=Service.query.all()
            for ser in service:
                listu.append({"id":ser.id,"name":ser.name,"description":ser.description,"price":ser.price})
            return listu,200
        if searchType=="service Request":
            requests=ServiceRequest.query.all()
            for req in requests:
                id=req.id
                customeruserid=Customer.query.filter_by(id=req.customerId).first().userId
                prouserid=Professional.query.filter_by(id=req.professionalId).first().userId
                custemail=User.query.filter_by(id=customeruserid).first().email
                proemail=User.query.filter_by(id=prouserid).first().email
                service=Service.query.filter_by(id=req.serviceId).first()
                if service is None:
                    serviceName="Service Not Found"
                else:
                    serviceName=service.name
                requ={"id":req.id,"custemail":custemail,"proemail":proemail,"serviceName":serviceName,"dateofrequest":req.dateofrequest,"dateofcompletion":req.dateofcompletion,"serviceStatus":req.serviceStatus,"feedback":req.feedback}
                listu.append(requ)
            return listu,200
        if searchType=="customer":
            customer=Customer.query.all()
            for cus in customer:
                user=User.query.filter_by(id=cus.userId).first()
                listu.append({"id":user.id,"name":cus.name,"email":user.email,"phone":cus.phone,"address":cus.address,"pincode":cus.pincode,"active":user.active})
            return listu,200
        if searchType=="professional":
            pro=Professional.query.all()
            for p in pro:
                user=User.query.filter_by(id=p.userId).first()
                listu.append({"id":user.id,"name":p.name,"email":user.email,"phone":p.phone,"address":p.address,"pincode":p.pincode,"serviceName":p.serviceName,"serviceId":p.serviceId,"experience":p.experience,"active":user.active})
            return listu,200

class custEmail(Resource):
    @auth_required('token')
    @roles_accepted('admin','customer')
    def get(self,email):
        user=User.query.filter_by(email=email).first()
        if user is None:
            return {"message":"User not found"},404
        cust=Customer.query.filter_by(userId=user.id).first()
        return {"custId":cust.id,"custUserID":cust.userId},200
    
class proReqCustDate(Resource):
    @auth_required('token')
    @roles_accepted('admin','customer')
    def get(self):
        req=ServiceRequest.query.all()

class req(Resource):
    @auth_required('token')
    @roles_accepted('admin','customer')
    @marshal_with(request_fields)
    def get(self):
        req=ServiceRequest.query.all()
        return req,200
    
class proEarning(Resource):
    @auth_required('token')
    @roles_accepted('admin','professional')
    def get(self,email):
        pro=Professional.query.filter_by(userId=User.query.filter_by(email=email).first().id).first()
        if pro is None:
            return {"message":"Customer not found"},404
        proId=pro.id
        earningPerService={}
        tot=0
        proStatus={"Customer Cancellation":0,"Pending":0,"accepeted":0,"Professional Rejection":0,"Completed":0,"Rejected":0,"Ongoing":0,"Not Completed":0}
        requests=ServiceRequest.query.filter_by(professionalId=proId).all()
        for req in requests:
            for j in proStatus:
                if req.serviceStatus==j or req.approve==j:
                    proStatus[j]+=1
            
            if req.serviceStatus=="Completed":
                service=Service.query.filter_by(id=req.serviceId).first()
                if service is None:
                    return {"message":"Service not found"},404
                if service.name in earningPerService:
                    earningPerService[req.dateofcompletion]+=service.price
                else:
                    earningPerService[req.dateofcompletion]=service.price
                    tot+=service.price
        return {"status":proStatus,"Earningperdate":earningPerService,"total":tot},200
    
class custspending(Resource):
    @auth_required('token')
    @roles_accepted('admin','customer')
    def get(self,email):
        cust=Customer.query.filter_by(userId=User.query.filter_by(email=email).first().id).first()
        if cust is None:
            return {"message":"Customer not found"},404
        custId=cust.id
        spendingperservice={}
        custstatus={"Customer Cancellation":0,"Pending":0,"accepted":0,"Professional Rejection":0,"Completed":0,"Rejected":0,"Ongoing":0,"Not Completed":0}
        requests=ServiceRequest.query.filter_by(customerId=custId).all()
        for req in requests:
            for j in custstatus:
                if req.serviceStatus==j or req.approve==j:
                    custstatus[j]+=1
            
            service=Service.query.filter_by(id=req.serviceId).first()
            if service is None:
                return {"message":"Service not found"},404
            if service.name in spendingperservice:
                spendingperservice[service.name]+=service.price
            else:
                spendingperservice[service.name]=service.price
        return {"status":custstatus,"spend":spendingperservice},200
    
class servearning(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    def get(self):
        services=Service.query.all()
        earning=0
        serv={}
        for s in services:
            serv[s.name]=0
        for ser in services:
            requests=ServiceRequest.query.filter_by(serviceId=ser.id).all()
            for req in requests:
                if req.serviceStatus=="Completed":
                    serv[ser.name]+=ser.price
        return serv,200

class allproearning(Resource):
    def get(self):
        pros=Professional.query.all()
        earning=0
        proEarning={}
        for p in pros:
            proEarning[p.name]=0
        for pro in pros:
            requests=ServiceRequest.query.filter_by(professionalId=pro.id).all()
            for req in requests:
                if req.serviceStatus=="Completed":
                    service=Service.query.filter_by(id=req.serviceId).first()
                    if service is None:
                        return {"message":"Service not found"},404
                    proEarning[pro.name]+=service.price
        return proEarning,200

adminparser=reqparse.RequestParser()
adminparser.add_argument('email',type=str,required=True)
adminparser.add_argument('currentPassword',type=str,required=True)
adminparser.add_argument('newPassword',type=str,required=True) 
class adminupdate(Resource):
    @auth_required('token')
    def patch(self):
        args= adminparser.parse_args()
        user=User.query.filter_by(email=args['email']).first()
        if user is None:
            return {"message":"User not found"},404
        if not verify_password(args['currentPassword'],user.password):
            return {"message":"Incorrect Password"},400
        user.password=hash_password(args['newPassword'])
        db.session.commit()
        return {"message":"Password Updated Sucessfully"},200
        
api.add_resource(adminupdate,'/adminUpdate')
api.add_resource(allproearning,'/proEarning')
api.add_resource(servearning,'/earning')
api.add_resource(custspending,'/customer/<string:email>/spending')
api.add_resource(proEarning,'/professional/<string:email>/earning')            
api.add_resource(req,'/requests_proper')
api.add_resource(custEmail,'/customer/<string:email>')
api.add_resource(searchall,'/search/<string:searchType>/')
api.add_resource(RequestIdsauce,'/requests/<int:id>')
api.add_resource(ServiceIdSauce,'/services/<int:id>')
api.add_resource(ProfessionalSauce,'/professional')
api.add_resource(CustomerSauce,'/customer')
api.add_resource(ServiceSauce,'/services')
api.add_resource(requestSauce,'/requests')