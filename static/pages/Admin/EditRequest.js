const EditService = {
    template: `
      <div>
        <h1>Edit Request</h1>
        <form @submit.prevent="updateService">
          <div>
            <label for="custE">Customer Email:</label>
            <select v-model="request.custE" id="custE" required>
              <option v-for="email in customerEmails" :key="email" :value="email">{{ email }}</option>
            </select>
          </div>
          <div>
            <label for="proE">Professional Email:</label>
            <select v-model="request.proE" id="proE" required>
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
            <input v-model="request.dateofrequest" type="date" id="dateofrequest" required />
          </div>
          <div>
            <label for="dateofcompletion">Date of Completion:</label>
            <input v-model="request.dateofcompletion" type="date" id="dateofcompletion" required />
          </div>
          <div>
            <label for="serviceStatus">Service Status:</label>
            <input v-model="request.serviceStatus" type="text" id="serviceStatus" required />
          </div>
          <button type="submit">Update Service</button>
        </form>
        <p v-if="message">{{ message }}</p>
      </div>
    `,
    data(){
      return {
        request: {
          id: null,
          custE: '',
          proE: '',
          servName: '',
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
      this.dropdown();
      this.fetchRequest();

    },
    methods: {
        async dropdown() {
            const id = this.$route.params.id;
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
        async fetchRequest() {
            const reqId = this.$route.params.id;

            try {
              const response = await fetch(`/api/requests/${reqId}`
                ,{headers:{
                  "Authentication-token":sessionStorage.getItem("token")
            }},
            );
              if (!response.ok) {
                throw new Error("Error fetching service details");
              }
              const data = await response.json();
              this.request = data;
              this.selectedService = this.request.servName;
              console.log(this.selectedService);
              console.log(this.request.servName);
            } catch (error) {
              console.error(error);
              this.message = 'Error fetching service details.';
            }
          }
        },
  };
  
  export default EditService;
  