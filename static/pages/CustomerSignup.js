import router from "../utils/router.js";

const CustomerSignup = {
  template: `
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4">
        <h3 class="card-title text-center mb-4">Customer Registraion</h3>
        <div class="form-group mb-3">
          <input v-model="name" type="text" class="form-control" placeholder="Name" required/>
        </div>
        <div class="form-group mb-3">
          <input v-model="phone" type="number" class="form-control" placeholder="phone" required/>
        </div>
        <div class="form-group mb-3">
          <input v-model="address" type="text" class="form-control" placeholder="Address" required/>
        </div>
        <div class="form-group mb-3">
          <input v-model="pincode" type="number" class="form-control" placeholder="Pincode" required/>
        </div>
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
      role:"customer",
      name:"",
      phone:"",
      address:"",
      pincode:""
    };
  },
  methods: {
    async submitInfo() {
      const origin = window.location.origin;
      const url = `${origin}/register`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          role: this.role,
          phone:this.phone,
          name:this.name,
          address:this.address,
          pincode:this.pincode
        }),
        credentials: "same-origin",
      });

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        // Handle successful sign up, e.g., redirect or store token
        router.push("/login");
      } else {
        const errorData = await res.json();
        console.error("Sign up failed:", errorData);
        // Handle sign up error
      }
    },
  },
};

export default CustomerSignup;