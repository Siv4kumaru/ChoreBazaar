import router from '../utils/router.js';
const Navbar ={
    template : 
    `<nav>
        <router-link to="/">Home</router-link>
        <router-link to="/Custdashboard">Dashboard</router-link>
        <router-link  to="/customerSignup">Customer Signup</router-link>
        <router-link  to="/proSignup">Professional Signup</router-link>
        <router-link  to="/login">Login</router-link>
        <router-link  to="/Profile">Profile</router-link>
        <a @click="logout">Logout</a>
        </nav>`,
        data(){
            return {
                
            };
        },
        methods:{
            logout(){
            console.log(window.location.hash);
            if(window.location.hash != "#/login"){
                sessionStorage.clear();
                router.push('/login')
                return
            }
            sessionStorage.clear()
        }
    }
};

export default Navbar;