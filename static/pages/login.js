const Login = {
  template: `
<div class="d-flex justify-content-center align-items-start vh-100">
<div class="card shadow p-4 border rounded-3 mt-10" style="max-width: 600px; width: 100%; margin:40px">
<div v-if="ErrorMessage" class="alert alert-danger" role="alert">
  {{ ErrorMessage }}
</div>
<div v-if="SuccessMessage" class="alert alert-success" role="alert">
  {{ SuccessMessage }}
</div>
    <div class="row g-0">
      <div class="col-md-5">
        <img src="static/src/sillohoute.png" class="img-fluid rounded-start" alt="..." />
      </div>
      <div class="col-md-7">
        <div class="card-body">
          <h3 class="card-title text-center mb-4">Login</h3>
          <form>
            <div class="form-group mb-3">
              <input v-model="email" type="email" class="form-control form-control-lg" placeholder="Email" required />
            </div>
            <div class="form-group mb-4">
              <input v-model="password" type="password" class="form-control form-control-lg" placeholder="Password" required />
            </div>
            <button type="submit" @click="submitInfo" class="btn w-100 py-2" style="background-color: #FAC012; border-color: #FAC012; color: black;">Login</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  data() {
    return {
      email: "",
      password: "",
      ErrorMessage: "",
      SuccessMessage:""
    };
  },
  methods: {
    async submitInfo(event) {
      event.preventDefault(); // Prevent form submission

      const url = window.location.origin;
      const res = await fetch(url + '/userLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: this.email, password: this.password }),
      });

      if (res.ok) {
        const data = await res.json();
        this.$store.commit("setRole", data.role);
        this.$store.commit("setLogin", true);
        
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('role', data.role);
        sessionStorage.setItem('email', this.email);
        this.SuccessMessage = "Login Successful";

        switch (data.role) {
          case "customer":
            this.$router.push("/Dashboard-Customer");
            break;
          case "professional":
            this.$router.push("/Dashboard-Professional");
            break;
          case "admin":
            this.$router.push("/Dashboard-Admin");
            break;
        }
      } else {
        const errorData = await res.json();
        console.error("Login Failed", errorData);
        this.ErrorMessage = errorData.message || "An unexpected error occurred. Please try again.";
        setTimeout(() => {
          this.ErrorMessage = "";
        }, 3000);
      }
    }
  },
  computed: {
    state() {
      return this.$store.state;
    }
  }
};

export default Login;
