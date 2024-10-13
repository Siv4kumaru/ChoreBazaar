import Profile from '../pages/Profile.js'
import Home from '../pages/Home.js'
import CustomerSignup from '../pages/CustomerSignup.js'
import ProSignup from '../pages/ProSignup.js'
import Login from '../pages/login.js'
import Logout from '../pages/logout.js'
import store from '../utils/store.js' 
import proDashboard from '../pages/Professional/proDashboard.js'
import adminDashboard from '../pages/Admin/adminDashboard.js'
import history from '../pages/Customer/history.js'
import statsA from '../pages/Admin/statsA.js'
import statsC from '../pages/Customer/statsC.js'
import statsP from '../pages/Professional/statsP.js'
import searchA from '../pages/Admin/searchA.js'
import searchC from '../pages/Customer/searchC.js'
import EditService from '../pages/Admin/EditService.js'
import addService from '../pages/Admin/addService.js'
import EditRequest from '../pages/Admin/EditRequest.js'
import custDashboard from '../pages/Customer/CustDashboard.js'
import historyP from '../pages/Professional/historyP.js'

const routes = [
    {path : '/', component: Home},
    {path : '/customerSignup', component: CustomerSignup},
    {path : '/proSignup', component: ProSignup},
    {path : '/login', component: Login},
    {path: '/Profile', component: Profile, meta: { requiresLogin: true }},
    {path: '/Dashboard-Customer', component: custDashboard , meta: { requiresLogin: true, role: "customer" }},
    {path: '/Dashboard-Professional', component: proDashboard , meta: { requiresLogin: true, role: "professional" }},
    {path: '/Dashboard-Admin', component: adminDashboard , meta: { requiresLogin: true, role: "admin" }},
    {path: '/statsA', component: statsA, meta: { requiresLogin: true, role: "admin" }},
    {path: '/statsC', component: statsC, meta: { requiresLogin: true, role: "customer" }},
    {path: '/statsP', component: statsP, meta: { requiresLogin: true, role: "professional" }},
    {path: '/searchA', component: searchA, meta: { requiresLogin: true, role: "admin" }},
    {path: '/searchC', component: searchC,name:"searchC", meta: { requiresLogin: true, role: "customer" }},
    {path : '/logout', component: Logout},
    {path: '/editService/:id',name:"editService",component: EditService, meta: { requiresLogin: true, role: "admin" }},
    {path: '/addService',name:"addService",component: addService, meta: { requiresLogin: true, role: "admin" }},
    {path: '/editRequest/:id',name:"editRequest",component: EditRequest, meta: { requiresLogin: true, role: "admin" }},
    {path: '/Dashboard-Customer/history', name:"historyC",component: history , meta: { requiresLogin: true, role: "customer" }},
    {path: '/Dashboard-Professional/history', name:"historyP",component: historyP , meta: { requiresLogin: true, role: "professional" }},

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