from flask_restful import marshal_with,Resource,Api,fields,reqparse
from flask_security import auth_required,roles_accepted
from models import User,Service,ServiceRequest,Customer,Professional
from extensions import db


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
reqPostparser.add_argument('professionalId', type=int, required=True)
reqPostparser.add_argument('serviceId', type=int, required=True)
reqPostparser.add_argument('dateofrequest', type=str, required=True)
reqPostparser.add_argument('dateofcompletion', type=str)
reqPostparser.add_argument('serviceStatus', type=str)
reqPostparser.add_argument('feedback', type=str)

reqPatchparser = reqparse.RequestParser()
reqPatchparser.add_argument('id', type=int, required=True)
reqPatchparser.add_argument('customerId', type=int)
reqPatchparser.add_argument('professionalId', type=int)
reqPatchparser.add_argument('serviceId', type=int)
reqPatchparser.add_argument('serviceStatus', type=str)
reqPatchparser.add_argument('feedback', type=str)
reqPatchparser.add_argument('dateofcompletion', type=str)
reqPatchparser.add_argument('dateofrequest', type=str)

reqDelparser = reqparse.RequestParser()


class requestSauce(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    @marshal_with(request_fields)
    def get(self):
        allRequests=ServiceRequest.query.all()
        return allRequests
    
    @auth_required('token')
    #@roles_accepted('customer')
    def post(self):
        args=reqPostparser.parse_args()
        if ServiceRequest.query.filter_by(customerId=args['customerId']).first() is not None and ServiceRequest.query.filter_by(professionalId=args['professionalId']).first() is not None and ServiceRequest.query.filter_by(serviceId=args['serviceId']).first() is not None:
            return {"message":"Request Already exists"},400
        if args.get('customerId') and Customer.query.filter_by(id=args['customerId']).first() is None:
            return {"message": "Customer does not exist"}, 400

        if args.get('professionalId') and Professional.query.filter_by(id=args.get('professionalId')).first() is None:
            return {"message": "Professional does not exist"}, 400

        if args.get('serviceId') and Service.query.filter_by(id=args.get('serviceId')).first() is None:
            return {"message": "Service does not exist"}, 400
        request=ServiceRequest(**args)
        db.session.add(request)
        db.session.commit()
        return {"message":"Request Created"},200
    
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
    @roles_accepted('admin')
    def patch(self):
        args=reqPatchparser.parse_args()
        request=ServiceRequest.query.filter_by(id=args['id']).first()

        if request is None:
            return {"message":"Request not found"},404
        if args.get('customerId') and Customer.query.filter_by(id=args['customerId']).first() is None:
            return {"message": "Customer does not exist"}, 400

        if args.get('professionalId') and Professional.query.filter_by(id=args.get('professionalId')).first() is None:
            return {"message": "Professional does not exist"}, 400

        if args.get('serviceId') and Service.query.filter_by(id=args.get('serviceId')).first() is None:
            return {"message": "Service does not exist"}, 400

        if args.get('customerId'):
            request.customerId = args['customerId']

        if args.get('professionalId'):
            request.professionalId = args['professionalId']

        if args.get('serviceId'):
            request.serviceId = args['serviceId']
        
        if args.get('serviceStatus'):
            request.serviceStatus = args['serviceStatus']

        if args.get('feedback'):
            request.feedback = args['feedback']

        if args.get('dateofrequest'):
            request.dateofrequest = args['dateofrequest']
        
        if args.get('dateofcompletion'):
            request.dateofcompletion = args['dateofcompletion']

        db.session.commit()
        return {"message":f"Request Updated"},200
    


class ServiceSauce(Resource):
    # @auth_required()
    # @roles_accepted('admin')
    @marshal_with(service_fields)
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
        return {"message":"Service Deleted"},200
    
    @auth_required('token')
    @roles_accepted('admin')
    def patch(self):
        args=patchParser.parse_args()
        service=Service.query.filter_by(id=args['id']).first()
        if service is None:
            return {"message":"Service not found"},404
        if Service.query.filter_by(name=args['name']).first() is not None:
            return {"message":"Service already exists"},400
        if args.get('name'):
            service.name = args['name']

        if args.get('description'):
            service.description = args['description']

        if args.get('price') is not None:
            service.price = args['price']
        db.session.commit()
        return {"message":"Service Updated"},200
    
api.add_resource(ServiceSauce,'/services')
api.add_resource(requestSauce,'/requests')