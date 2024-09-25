import router from '../utils/router.js';
const Navbar ={
    template : 
    `<nav>
        <router-link to="/">Home</router-link>
        <router-link v-if="state.loggedIn" to="/Dashboard">Dashboard</router-link>
        <router-link v-if="!state.loggedIn" to="/customerSignup">Customer Signup</router-link>
        <router-link v-if="!state.loggedIn" to="/proSignup">Professional Signup</router-link>
        <router-link v-if="!state.loggedIn" to="/login">Login</router-link>
        <router-link v-if="state.loggedIn" to="/Profile">Profile</router-link>
        <button class="btn btn-warning text-xl" v-if="state.loggedIn" @click="logout">Logout</button>
        </nav>`,
        methods:{
            logout(){
            sessionStorage.clear();

            this.$store.commit("logout");
            this.$store.commit("setRole", null);

            this.$router.push('/login')
        }
    },
    computed:{
        state(){
            return this.$store.state;
        }
    }
};

export default Navbar;