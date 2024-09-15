from flask_restful import marshal_with,Resource,Api,fields,reqparse
from flask_security import auth_required,roles_accepted
from models import Service
from extensions import db

api=Api(prefix='/api')
#marshelling


parser  = reqparse.RequestParser() #convert data to json
parser.add_argument('name',type=str,required=True)
parser.add_argument('description',type=str,required=True)
parser.add_argument('price',type=float,required=True)

delParser=reqparse.RequestParser()
delParser.add_argument('id',type=str,required=True)

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