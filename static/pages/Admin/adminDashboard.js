const adminDashboard ={
    template:`<div>
        welcome admin:{{email}}
    </div>`,
    data(){
        return{
            email:sessionStorage.getItem('email')
    };
}
}

export default adminDashboard;