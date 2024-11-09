import router from './utils/router.js';
import Navbar from './components/Navbar.js';
import store from './utils/store.js';
new Vue({
    el: '#app',
    template: ` 
    <div>
    <div v-for="(message, index) in flashMessages" :key="index" class="popup">
    {{ message }}
    </div>
    <Navbar/>
    <router-view/>
    </div>
    `,
    router,
    store,
    data: {
        flashMessages: []
    },        
    components: {
        Navbar,
    },
})