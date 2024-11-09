const Navbar ={
    template : 
    `
    <div>
    <nav>
    <ul class="nav nav-pills justify-content-around justify-content-between justify-content-evenly">
        <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
        </li>
        <li class="nav-item">
            <router-link v-if="!state.loggedIn" to="/login">Login</router-link>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Dropdown</a>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
        </li>
        <li class="nav-item">
            <router-link v-if="state.loggedIn && state.role === 'customer'" to="/dashboard-Customer">Dashboard</router-link>
        </li>
        <li class="nav-item">
            <router-link v-if="state.loggedIn && state.role === 'professional'" to="/dashboard-Professional">Dashboard</router-link>
        </li>
        <li class="nav-item">
            <router-link v-if="state.loggedIn && state.role === 'admin'" to="/dashboard-admin">Dashboard</router-link>
        </li>
        <li class="nav-item">
            <router-link v-if="!state.loggedIn" to="/customerSignup">Customer Signup</router-link>
        </li>
        <li class="nav-item">
            <router-link v-if="!state.loggedIn" to="/proSignup">Professional Signup</router-link>
        </li>
        <li class="nav-item">
            <router-link v-if="state.loggedIn && state.role === 'admin'" to="/searchA">Search</router-link>
        </li>
        <li class="nav-item">
            <router-link v-if="state.loggedIn && state.role === 'customer'" to="/searchC">Search</router-link>
        </li>
        <li class="nav-item">
            <router-link v-if="state.loggedIn && state.role === 'admin'" to="/ProfileA">Profile</router-link>       
        </li>
        <li class="nav-item">
            <router-link v-if="state.loggedIn && state.role === 'customer'" to="/ProfileC">Profile</router-link>       
        </li>
        <li class="nav-item">
            <router-link v-if="state.loggedIn && state.role === 'professional'" to="/ProfileP">Profile</router-link>       
        </li>   
        <li class="nav-item">
            <router-link v-if="state.loggedIn && state.role === 'admin'" to="/statsA">Stats</router-link>
        </li>
        <li class="nav-item">
            <router-link v-if="state.loggedIn && state.role === 'customer'" to="/statsC">Stats</router-link>
        </li>
        <li class="nav-item">
            <router-link v-if="state.loggedIn && state.role === 'professional'" to="/statsP">Stats</router-link> 
        </li>
        <li class="nav-item">
            <button class="btn btn-warning text-xl" v-if="state.loggedIn" @click="logout">Logout</button>
        </li>
    </ul>
</nav>
</div>`,
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