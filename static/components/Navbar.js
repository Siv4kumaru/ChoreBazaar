
const Navbar ={
    template : 
    `<nav>
        <router-link to="/">Home</router-link>
        <router-link v-show="!loggedIn" to="/Custdashboard">Dashboard</router-link>
        <router-link v-show="!loggedIn" to="/customerSignup">Customer Signup</router-link>
        <router-link v-show="!loggedIn" to="/proSignup">Professional Signup</router-link>
        <router-link v-show="!loggedIn" to="/login">Login</router-link>
        <a :href="url">logout</a>
    </nav>`,
    data(){
        return {
            loggedIn: false,
            url: window.location.origin + "/logout"
        };
    }
};

export default Navbar;