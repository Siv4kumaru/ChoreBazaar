import router from "../utils/router.js";

const Login = {
  template: `
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4 border rounded-3 ">
        <h3 class="card-title text-center mb-4">Login</h3>
        <div class="form-group mb-3">
          <input v-model="email" type="email" class="form-control" placeholder="Email" required/>
        </div>
        <div class="form-group mb-4">
          <input v-model="password" type="password" class="form-control" placeholder="Password" required/>
        </div>
        <button class="btn btn-primary w-100" @click="submitInfo">Submit</button>
      </div>
    </div>
  `,
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async submitInfo() {
      const url = window.location.origin
      const res = await fetch(url+'/userLogin',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({email:this.email,password:this.password})
    });
    if (res.ok){
      const data = await res.json();
      this.$store.commit("setRole", data.role);
      this.$store.commit("setLogin", true);
      
      sessionStorage.setItem('token',data.token)
      sessionStorage.setItem('role',data.role)
      sessionStorage.setItem('email',this.email)
      

      router.push('/Dashboard');

      switch (data.role) {
        case "customer":
          this.$router.push("/Dashboard");
          break;
        case "professional":
          break;
        case "admin":
          break;
      }
    }else{
      console.error("Login Failed");
    }
    }
  },
  computed:{
    state(){
        return this.$store.state;
    }
}
};

export default Login;