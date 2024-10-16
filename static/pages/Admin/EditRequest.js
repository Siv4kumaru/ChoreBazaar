const EditService = {
    template: `
      <div>
        <h1>Edit Request</h1>
        <form @submit.prevent="updateService">
          <div>
            <label for="custE">Customer Email:</label>
            <select v-model="selectedCustEmail" id="custE" required>
              <option v-for="email in custEmail" :value="email">{{ email }}</option>
            </select>
          </div>
          <div>
            <label for="proE">Professional Email:</label>
            <select v-model="selectedProEmail" id="proE" required>
              <option v-for="email in proEmail" :key="email" :value="email">{{ email }}</option>
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
          custEmail: '',
          proEmail: '',
          serviceName: '',
          dateofrequest: '',
          dateofcompletion: '',
          serviceStatus: '',
        },
        serviceName: [],
        selectedService:'',
        custEmail: [],
        proEmail: [],
        selectedCustEmail: '',
        selectedProEmail: '',
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
                for (let i in data) {
                this.serviceName.push(data[i].name);
                };

                const response2 = await fetch(`/api/customer`, {
                  headers: {
                    "Authentication-token": sessionStorage.getItem("token"),
                  },
                });
                if (!response2.ok) {
                  throw new Error("Error fetching customer details");
                }
                const data2 = await response2.json();
                for (let i in data2){
                  this.custEmail.push(data2[i].email);
                }

                const response3 = await fetch(`/api/professional`, {
                  headers: {
                    "Authentication-token": sessionStorage.getItem("token"),
                  },
                });
                if (!response3.ok) {
                  throw new Error("Error fetching professional details");
                }
                const data3 = await response3.json();
                for (let i in data3){
                  this.proEmail.push(data3[i].email);
                }

                
  
            } catch (error) {
              console.error(error);
              this.message = 'Error fetching details.';
    
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
              console.log(this.request);

              this.selectedService = this.request.serviceName;
              this.selectedCustEmail = this.request.custEmail; 
              this.selectedProEmail = this.request.proEmail;
              
            } catch (error) {
              console.error(error);
              this.message = 'Error fetching service details.';
            }
          },
          async updateService() {
            const reqId = this.$route.params.id;
            try {
              const response = await fetch('/api/requests', {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  "Authentication-token":sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                  "id": reqId,
                  "custEmail": this.selectedCustEmail,
                  "proEmail": this.selectedProEmail,
                  "serviceName": this.selectedService,
                  "dateofrequest": this.request.dateofrequest,
                  "dateofcompletion": this.request.dateofcompletion,
                  "serviceStatus": this.request.serviceStatus,
                }),
              });
              if (response.ok) {
                this.message = 'Service updated successfully.';
                console.log(this.message);
                this.$router.push("/Dashboard-Admin");
              }
      
              if (!response.ok) {
                throw new Error("Error updating service");
              }
              else{
              const data = await response.json();
              this.message = data.message;}
            } catch (error) {
              console.error(error);
              this.message = 'Error updating service.';
            }
          },
        },

  };
  
  export default EditService;
  