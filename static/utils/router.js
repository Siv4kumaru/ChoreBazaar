import Profile from '../pages/Profile.js'
import Home from '../pages/Home.js'
import CustomerSignup from '../pages/CustomerSignup.js'
import ProSignup from '../pages/ProSignup.js'
import Login from '../pages/login.js'
import Logout from '../pages/logout.js'
import store from '../utils/store.js' 
import proDashboard from '../pages/Professional/proDashboard.js'
import adminDashboard from '../pages/Admin/adminDashboard.js'
import custDashboard from '../pages/Customer/custDashboard.js'

const routes = [
    {path : '/', component: Home},
    {path : '/customerSignup', component: CustomerSignup},
    {path : '/proSignup', component: ProSignup},
    {path : '/login', component: Login},
    {path : '/logout', component: Logout},
    {path: '/Dashboard-Customer', component: custDashboard , meta: { requiresLogin: true, role: "customer" }},
    {path: '/Dashboard-Professional', component: proDashboard , meta: { requiresLogin: true, role: "professional" }},
    {path: '/Dashboard-Admin', component: adminDashboard , meta: { requiresLogin: true, role: "admin" }},
    {path: '/Profile', component: Profile, meta: { loggedIn: true }},
]

const router = new VueRouter({
    routes,
})
// frontend router protection
router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresLogin)) {
      if (!store.state.loggedIn) {
        next({ path: "/login" });
      } else if (to.meta.role && to.meta.role !== store.state.role) {
        next({ path: "/" });
      } else {
        next();
      }
    } else {
      next();
    }
  });
  
export default router