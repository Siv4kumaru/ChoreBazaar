import router from '../utils/router.js';
const Navbar ={
    template : 
    `<nav>
        <router-link to="/">Home</router-link>
        <router-link v-if="state.loggedIn && state.role === 'customer'" to="/dashboard-Customer">Dashboard</router-link>
        <router-link v-if="state.loggedIn && state.role === 'professional'" to="/dashboard-Professional">Dashboard</router-link>
        <router-link v-if="state.loggedIn && state.role === 'admin'" to="/dashboard-admin">Dashboard</router-link>
        <router-link v-if="!state.loggedIn" to="/customerSignup">Customer Signup</router-link>
        <router-link v-if="!state.loggedIn" to="/proSignup">Professional Signup</router-link>
        <router-link v-if="!state.loggedIn" to="/login">Login</router-link>
        <router-link v-if="state.loggedIn" to="/Profile">Profile</router-link>
        <router-link v-if="state.loggedIn && state.role === 'admin'" to="/searchA">Search</router-link>
        <router-link v-if="state.loggedIn && state.role === 'customer'" to="/searchC">Search</router-link>
        <router-link v-if="state.loggedIn && state.role === 'professional'" to="/searchP">Search</router-link>
        <router-link v-if="state.loggedIn && state.role === 'admin'" to="/statsA">Stats</router-link>
        <router-link v-if="state.loggedIn && state.role === 'customer'" to="/statsC">Stats</router-link>
        <router-link v-if="state.loggedIn && state.role === 'professional'" to="/statsP">Stats</router-link>        
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