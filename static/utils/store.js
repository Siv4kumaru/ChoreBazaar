Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loggedIn: sessionStorage.getItem('loggedIn') === 'true' || false,
    role: sessionStorage.getItem('role') || "",
  },

  mutations: {
    setLogin(state) {
      state.loggedIn = true;
      sessionStorage.setItem('loggedIn', true); 
    },
    logout(state) {
      state.loggedIn = false;
      state.role = "";
      sessionStorage.removeItem('loggedIn');     // Clear login state
      sessionStorage.removeItem('role');         // Clear role state
    },
    setRole(state, role) {
      state.role = role;
      sessionStorage.setItem('role', role);     // Set role state
    },
  },
  
});



export default store;