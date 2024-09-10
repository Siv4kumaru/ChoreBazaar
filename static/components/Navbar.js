const Navbar ={
    template : 
    `<nav>
        <router-link to="/">Home</router-link>
        <router-link to="/login">Login</router-link>
        <router-link to="/CustomerSignup">Customer Signup</router-link>
        <router-link to="/proSignup">Professional Signup</router-link>
        <a :href="url">logout</a>
    </nav>`,
    data(){
        return {
            url: window.location.origin + "/logout"
        };
    }
};

export default Navbar;