const Navbar = {
    template: `
      <div id="navbar">
        <nav class="navbar navbar-expand-md navbar-light bg-light justify-content-between">
          <div class="container-fluid">
            <router-link class="navbar-brand" to="/"><img src="/static/src/LOGO.png" width="145em" alt="Logo" /></router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
  
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav nav-pills ms-2">
                <li class="nav-item ms-3"><router-link class="nav-link" :class="{ active: isActive('/') }" to="/">Home</router-link></li>
                
                <!-- Login/Signup Links (if not logged in) -->
                <template v-if="!state.loggedIn">
                    <li class="nav-item ms-3"><router-link class="nav-link" :class="{ active: isActive('/login') }" to="/login">Login</router-link></li>

                    <li class="nav-item dropdown ms-3">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Signup</a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li class="nav-item"><router-link class="nav-link" :class="{ active: isActive('/customerSignup') }" to="/customerSignup">Customer Signup</router-link></li>
                        <li class="nav-item"><router-link class="nav-link" :class="{ active: isActive('/proSignup') }" to="/proSignup">Professional Signup</router-link></li>
                    </ul>
                    </li>
                </template>

                <!-- Menu and Dashboard Links (if logged in) -->
                <template v-if="state.loggedIn">
                    <!-- Dashboard Links -->
                    <li v-if="state.role === 'customer'" class="nav-item ms-3">
                    <router-link class="nav-link" :class="{ active: isActive('/dashboard-customer') }" to="/dashboard-customer">Dashboard</router-link>
                    </li>
                    <li v-if="state.role === 'professional'" class="nav-item ms-3">
                    <router-link class="nav-link" :class="{ active: isActive('/dashboard-professional') }" to="/dashboard-professional">Dashboard</router-link>
                    </li>
                    <li v-if="state.role === 'admin'" class="nav-item ms-3">
                    <router-link class="nav-link" :class="{ active: isActive('/dashboard-admin') }" to="/dashboard-admin">Dashboard</router-link>
                    </li>

                    <!-- Profile Links -->
                    <li v-if="state.role === 'customer'" class="nav-item ms-3">
                    <router-link class="nav-link" :class="{ active: isActive('/ProfileC') }" to="/ProfileC">Profile</router-link>
                    </li>
                    <li v-if="state.role === 'professional'" class="nav-item ms-3">
                    <router-link class="nav-link" :class="{ active: isActive('/ProfileP') }" to="/ProfileP">Profile</router-link>
                    </li>
                    <li v-if="state.role === 'admin'" class="nav-item ms-3">
                    <router-link class="nav-link" :class="{ active: isActive('/ProfileA') }" to="/ProfileA">Profile</router-link>
                    </li>

                    <!-- Search and Stats Links -->
                    <li v-if="state.role === 'customer'" class="nav-item ms-3">
                    <router-link class="nav-link" :class="{ active: isActive('/searchC') }" to="/searchC">Search</router-link>
                    </li>
                    <li v-if="state.role === 'customer'" class="nav-item ms-3">
                    <router-link class="nav-link" :class="{ active: isActive('/statsC') }" to="/statsC">Stats</router-link>
                    </li>
                    <li v-if="state.role === 'professional'" class="nav-item ms-3">
                    <router-link class="nav-link" :class="{ active: isActive('/statsP') }" to="/statsP">Stats</router-link>
                    </li>
                    <li v-if="state.role === 'admin'" class="nav-item ms-3">
                    <router-link class="nav-link" :class="{ active: isActive('/searchA') }" to="/searchA">Search</router-link>
                    </li>
                    <li v-if="state.role === 'admin'" class="nav-item ms-3">
                    <router-link class="nav-link" :class="{ active: isActive('/statsA') }" to="/statsA">Stats</router-link>
                    </li>
                </template>
                </ul>

            </div>
  
            <!-- Logout Button -->
            <button class="btn btn-warning me-3" v-if="state.loggedIn" @click="logout">Logout</button>
          </div>
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
  