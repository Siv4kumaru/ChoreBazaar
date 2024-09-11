import Home from '../pages/Home.js'
import CustomerSignup from '../pages/CustomerSignup.js'
import ProSignup from '../pages/ProSignup.js'
import Login from '../pages/login.js'
import Logout from '../pages/logout.js'
import CustDashboard from '../pages/CustDashboard.js'

const routes = [
    {path : '/', component: Home},
    {path : '/customerSignup', component: CustomerSignup},
    {path : '/proSignup', component: ProSignup},
    {path : '/login', component: Login},
    {path : '/logout', component: Logout},
    { path: '/Custdashboard', component: CustDashboard }
]

const router = new VueRouter({
    routes,
})

export default router