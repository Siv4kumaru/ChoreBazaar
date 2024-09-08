import Home from '../pages/Home.js'
import Signup from '../pages/signup.js'
import Login from '../pages/login.js'
import Logout from '../pages/logout.js'

const routes = [
    {path : '/', component: Home},
    {path : '/signup', component: Signup},
    {path : '/login', component: Login},
    {path : '/logout', component: Logout},
]

const router = new VueRouter({
    routes,
})

export default router