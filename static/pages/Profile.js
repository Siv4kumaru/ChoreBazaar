const Profile ={
    template:`<div>
        welcome {{email}}
    </div>`,
    data(){
        return{
            email:sessionStorage.getItem('email')
    };
}
}

export default Profile;