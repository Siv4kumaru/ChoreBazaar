const EditService = {
    template: `
      <div>
        <h1>Edit Service</h1>
        <form @submit.prevent="updateService">
          <div>
            <label for="custE">Customer Email:</label>
            <select v-model="service.custE" id="custE" required>
              <option v-for="email in customerEmails" :key="email" :value="email">{{ email }}</option>
            </select>
          </div>
          <div>
            <label for="proE">Professional Email:</label>
            <select v-model="service.proE" id="proE" required>
              <option v-for="email in professionalEmails" :key="email" :value="email">{{ email }}</option>
            </select>
          </div>
          <div>
            <label for="servName">Service Name:</label>
            <select v-model="selectedService" id="servName" required>
              <option v-for="s in serviceName" :value="s">{{ s }}</option>
            </select>
          </div>
          <div>
            <label for="dateofrequest">Date of Request:</label>
            <input v-model="service.dateofrequest" type="date" id="dateofrequest" required />
          </div>
          <div>
            <label for="dateofcompletion">Date of Completion:</label>
            <input v-model="service.dateofcompletion" type="date" id="dateofcompletion" required />
          </div>
          <div>
            <label for="serviceStatus">Service Status:</label>
            <input v-model="service.serviceStatus" type="text" id="serviceStatus" required />
          </div>
          <button type="submit">Update Service</button>
        </form>
        <p v-if="message">{{ message }}</p>
      </div>
    `,
    data(){
      return {
        service: {
          id: null,
          servieName:'',
          custE: '',
          proE: '',
          dateofrequest: '',
          dateofcompletion: '',
          serviceStatus: '',
        },
        serviceName: [],
        selectedService:'',
        customerEmails: ['cust1@example.com', 'cust2@example.com'], // replace with actual data
        professionalEmails: ['pro1@example.com', 'pro2@example.com'], // replace with actual data
        message: '',
      };
    },
    mounted() {
      this.fetchService();
    },
    methods: {
        async fetchService() {
            const id = this.$route.params.id;
            console.log(id) // Assuming the service ID is passed in the route
            try {
              const response = await fetch(`/api/services`, {
                headers: {
                  "Authentication-token": sessionStorage.getItem("token"),
                },
              });
              if (!response.ok) {
                throw new Error("Error fetching service details");
              }
              const data = await response.json();
              console.log(data);
              const Snames = [];
                for (let i in data) {
                Snames.push(data[i].name);
                };
              
              this.serviceName = Snames;
            } catch (error) {
              console.error(error);
              this.message = 'Error fetching service details.';
    
            }
          },

      async dropdown() {
        const serviceId = this.$route.params;
        console.log(serviceId) // Assuming the service ID is passed in the route
        try {
          const response = await fetch(`/api/services/{}`, {
            method: 'patch',
            headers: {
              'Content-Type': 'application/json',
              "Authentication-token": sessionStorage.getItem("token"),
            },
            body: JSON.stringify(this.service),
          });
          if (!response.ok) {
            throw new Error("Error updating service");
          }
          const data = await response.json();
          this.message = 'Service updated successfully.';
          this.$router.push("/Dashboard-Admin");
        } catch (error) {
          console.error(error);
          this.message = 'Error updating service.';
        }
      },
    },
  };
  
  export default EditService;
  