import router from "../utils/router.js";

const ProSignup = {
  template: `
<div class="d-flex justify-content-center align-items-start vh-100">
  <form>
    <div class="card shadow p-4">
      <h3 class="card-title text-center mb-4">Professional Registration</h3>
      <div v-if="ErrorMessage" class="alert alert-danger" role="alert">
        {{ ErrorMessage }}
      </div>
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
      <!-- PDF Input Field -->
      <div class="form-group mb-4">
        <label>Resume</label>
        <input type="file" @change="validatePdf" class="form-control" accept="application/pdf" required />
      </div>
      <button class="btn w-100 py-2" type="submit" @click="submitInfo" style="background-color: #FAC012; border-color: #FAC012; color: black;">Register</button>
    </div>
  </form>
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
      services: [],
      ErrorMessage: "",
      selectedPdf: null,
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
    validatePdf(event) {
      const file = event.target.files[0];
      if (file) {
        const maxSize = 5 * 1024 * 1024; // 5 MB
        if (file.size > maxSize) {
          this.ErrorMessage = "File size must be less than 5 MB.";
          setTimeout(() => { this.ErrorMessage = ""; }, 3000);
          event.target.value = ""; // Clear the file input
        } else {
          this.selectedPdf = file;
        }
      }
    },
    async submitInfo(event) {
      event.preventDefault();
      
      if (!this.selectedPdf) {
        this.ErrorMessage = "Please upload a PDF document.";
        return;
      }
      
      const formData = new FormData();
      formData.append("email", this.email);
      formData.append("password", this.password);
      formData.append("role", this.role);
      formData.append("phone", this.phone);
      formData.append("name", this.name);
      formData.append("service", this.service);
      formData.append("experience", this.experience);
      formData.append("address", this.address);
      formData.append("pincode", this.pincode);
      formData.append("pdfDocument", this.selectedPdf); // Add PDF file
      
      const origin = window.location.origin;
      const url = `${origin}/register`;
      const res = await fetch(url, {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });
      
      if (res.ok) {
        console.log("Sign up successful");
        this.SuccessMessage = "Signup Successful";
        window.localStorage.setItem("email", this.email);
        window.localStorage.setItem("password", this.password);
        router.push("/login");
      } else {
        const errorData = await res.json();
        this.ErrorMessage = errorData["message"] || "An unexpected error occurred. Please try again.";
        setTimeout(() => {
          this.ErrorMessage = "";
        }, 3000);
      }
    },
  },
};

export default ProSignup;
