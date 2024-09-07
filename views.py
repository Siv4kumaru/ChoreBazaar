from flask import render_template_string,render_template
from flask_security import auth_required,current_user,roles_accepted

def create_view(app):
    @app.route('/')
    def home():
        return render_template("index.html")


    @app.route('/profile')
    @auth_required('session','token','basic')
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