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
    
    @auth_required()
    @roles_accepted('admin')
    def post(self):
        args=parser.parse_args()
        service=Service(**args)
        db.session.add(service)
        db.session.commit()
        return {"message":"Service Created"},200

api.add_resource(ServiceSauce,'/services')