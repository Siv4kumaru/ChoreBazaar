const Navbar = {
    template: `
      <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="container-fluid">
            <router-link class="navbar-brand" to="/">MyApp</router-link>
            <button 
              class="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" 
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav nav-pills ms-2">
                <li class="nav-item">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: isActive('/') }" 
                    aria-current="page" 
                    to="/"
                  >
                    Home
                  </router-link>
                </li>
                <li class="nav-item" v-if="!state.loggedIn">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: isActive('/login') }" 
                    to="/login"
                  >
                    Login
                  </router-link>
                </li>
                <li class="nav-item dropdown" v-if="state.loggedIn">
                  <a 
                    class="nav-link dropdown-toggle" 
                    href="#" 
                    id="navbarDropdown" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    Menu
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </li>
                <li class="nav-item" v-if="state.loggedIn && state.role === 'customer'">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: isActive('/dashboard-Customer') }" 
                    to="/dashboard-Customer"
                  >
                    Dashboard
                  </router-link>
                </li>
                <li class="nav-item" v-if="state.loggedIn && state.role === 'professional'">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: isActive('/dashboard-Professional') }" 
                    to="/dashboard-Professional"
                  >
                    Dashboard
                  </router-link>
                </li>
                <li class="nav-item" v-if="state.loggedIn && state.role === 'admin'">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: isActive('/dashboard-admin') }" 
                    to="/dashboard-admin"
                  >
                    Dashboard
                  </router-link>
                </li>
                <li class="nav-item" v-if="!state.loggedIn">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: isActive('/customerSignup') }" 
                    to="/customerSignup"
                  >
                    Customer Signup
                  </router-link>
                </li>
                <li class="nav-item" v-if="!state.loggedIn">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: isActive('/proSignup') }" 
                    to="/proSignup"
                  >
                    Professional Signup
                  </router-link>
                </li>
                <li class="nav-item" v-if="state.loggedIn && state.role === 'admin'">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: isActive('/searchA') }" 
                    to="/searchA"
                  >
                    Search
                  </router-link>
                </li>
                <li class="nav-item" v-if="state.loggedIn && state.role === 'customer'">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: isActive('/searchC') }" 
                    to="/searchC"
                  >
                    Search
                  </router-link>
                </li>
                <li class="nav-item" v-if="state.loggedIn && state.role === 'admin'">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: isActive('/ProfileA') }" 
                    to="/ProfileA"
                  >
                    Profile
                  </router-link>
                </li>
                <li class="nav-item" v-if="state.loggedIn && state.role === 'customer'">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: isActive('/ProfileC') }" 
                    to="/ProfileC"
                  >
                    Profile
                  </router-link>
                </li>
                <li class="nav-item" v-if="state.loggedIn && state.role === 'professional'">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: isActive('/ProfileP') }" 
                    to="/ProfileP"
                  >
                    Profile
                  </router-link>
                </li>
                <li class="nav-item" v-if="state.loggedIn && state.role === 'admin'">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: isActive('/statsA') }" 
                    to="/statsA"
                  >
                    Stats
                  </router-link>
                </li>
                <li class="nav-item" v-if="state.loggedIn && state.role === 'customer'">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: isActive('/statsC') }" 
                    to="/statsC"
                  >
                    Stats
                  </router-link>
                </li>
                <li class="nav-item" v-if="state.loggedIn && state.role === 'professional'">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: isActive('/statsP') }" 
                    to="/statsP"
                  >
                    Stats
                  </router-link>
                </li>
                </ul>
                </div>
                </div>
                <button 
                class="btn btn-warning me-3 justify-content-end" 
                v-if="state.loggedIn" 
                @click="logout"
                
                >
                Logout
                </button>
        </nav>
      </div>
    `,
    methods: {
      logout() {
        sessionStorage.clear();
        this.$store.commit("logout");
        this.$store.commit("setRole", null);
        this.$router.push('/login');
      },
      isActive(path) {
        return this.$route.path === path;
      }
    },
    computed: {
      state() {
        return this.$store.state;
      }
    }
  };
  
  export default Navbar;
  