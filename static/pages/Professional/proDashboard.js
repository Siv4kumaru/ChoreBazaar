const ProDashboard ={
    template:`<div>
        welcome pro:{{email}}
    </div>`,
    data(){
        return{
            email:sessionStorage.getItem('email')
    };
}
}

export default ProDashboard;