import router from "../utils/router.js";

const ProSignup = {
  template: `
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4">
        <h3 class="card-title text-center mb-4">Professional Registraion</h3>
        <div class="form-group mb-3">
          <input v-model="name" type="text" class="form-control" placeholder="Name" required/>
        </div>
        <div class="form-group mb-3">
          <input v-model="phone" type="number" class="form-control" placeholder="Phone" required/>
        </div>
        <div class="form-group mb-3">
          <select v-model="service" class="form-control" required>
            <option value="" disabled selected>Service Type</option>
            <option v-for="service in services" :key="service.id" :value="service.name">
              {{ service.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group mb-3">
          <input v-model="experience" type="number" class="form-control" placeholder="Experience in number" required/>
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
        role: "professional",
        name: "",
        phone: "",
        service: "",
        experience: "",
        address: "",
        pincode: "",
        services: []
    };
  },
  mounted() {
    this.fetchServices();  
  },
  methods: {
    async fetchServices() {
      try {
        const response = await fetch('/dropdownService');
        if (response.ok) {
          this.services = await response.json();
        } else {
          console.error('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    },
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
            phone: this.phone,
            name: this.name,
            service: this.service,
            experience: this.experience,
            address: this.address,
            pincode: this.pincode
        }),
        credentials: "same-origin",
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
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

export default ProSignup;