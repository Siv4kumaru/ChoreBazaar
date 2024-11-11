import router from "../utils/router.js";

const CustomerSignup = {
  template: `
    <div class="d-flex justify-content-center align-items-start vh-100 " style="margin-top: 40px" >
      <div class="card shadow p-4">
      <div v-if="ErrorMessage" class="alert alert-danger" role="alert">
        {{ ErrorMessage }}
      </div>
      <div v-if="SuccessMessage" class="alert alert-success" role="alert">
        {{ SuccessMessage }}
      </div>

        <h3 class="card-title text-center mb-4">Customer Registraion</h3>
        <form>
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
          <button class="btn w-100 py-2" @click="submitInfo" style="background-color: #FAC012; border-color: #FAC012; color: black;">sign up</button>
        </form>
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
      pincode:"",
      ErrorMessage: "",
      SuccessMessage:""
    };
  },
  methods: {
    async submitInfo() {

      if (this.email == "" || this.password == "" || this.role == "" || this.phone == "" || this.name == "" ||this.address == "" || this.pincode == "") {
        console.error("Fill All the Fields"),404;
        return;
      }
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

      console.log("response",res);
      if (res.status === 200 ) {
        console.log("Sign up successful");
        this.SuccessMessage = "Signup Successful";
        window.localStorage.setItem('email', this.email);
        window.localStorage.setItem('password',this.password);
        router.push("/login");
      } 
      else {

        const errorData =  await res.json();
        console.error("Sign up failed:", errorData);
        this.ErrorMessage = errorData["message"] || "An unexpected error occurred. Please try again.";
        setTimeout(() => {
          this.ErrorMessage = "";
        }, 3000);
      }
    },
  },
};

export default CustomerSignup;