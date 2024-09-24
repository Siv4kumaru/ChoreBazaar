import services from "../components/services.js";

const CustDashboard = {
  template:`<div>
    <h1>Customere Dashboard</h1>
      <div class="d-flex flex-row justify-content-center">
         <div v-for="service in allServices"  >
        <services :name="service.name" :description="service.description" :price="service.price"></services>
      </div>
      </div>
    </div>

  `,
  data() {
    return {
      allServices: [],
    };
  },
  async mounted() {
    const res=await fetch(window.location.origin+"/api/services",{
      headers:{
        "Authentication":sessionStorage.getItem("token")
      }
    });
    if (res.ok) {
    const data = await res.json();
    this.allServices = data;
    console.log(this.allServices);  
    }
  },
  components: { services },
};
export default CustDashboard;