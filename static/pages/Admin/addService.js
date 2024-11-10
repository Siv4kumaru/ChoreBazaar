const addService = {
  template: `
  <div class="container mt-4">
<div v-if="eMsg" class="alert alert-danger" role="alert">
  {{ eMsg }}
</div>

<div v-if="sMsg" class="alert alert-success" role="alert">
  {{ sMsg }}
</div>
  <h1>Add Service</h1>
  <form @submit.prevent="AddService">
    <div class="mb-3">
      <label for="name" class="form-label">Service Name:</label>
      <input v-model="service.name" type="text" id="name" class="form-control" required />
    </div>
    <div class="mb-3">
      <label for="description" class="form-label">Description:</label>
      <textarea v-model="service.description" id="description" class="form-control" required></textarea>
    </div>
    <div class="mb-3">
      <label for="price" class="form-label">Price:</label>
      <input v-model="service.price" type="number" id="price" class="form-control" required />
    </div>
    <button type="submit" class="btn" style="background-color: #FAC012;">Add Service</button>
  </form>
</div>
  `,
  data() {
    return {
      service: {
          id: null,
          name: '',
          description: '',
          price: null,
        },
        sMsg:'',
        eMsg:'',
    };
  },
  methods: {
    // Fetch the service details
    // Update the service using PATCH
    async AddService() {
      const serviceId = this.$route.params.id;
      try {
        const response = await fetch('/api/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authentication-token":sessionStorage.getItem("token")
          },
          body: JSON.stringify({
            "name": this.service.name,
            "description": this.service.description,
            "price": this.service.price,
          }),
        });
        if (response.ok) {
          this.sMsg = 'Service added successfully.';
          console.log(this.message);
          this.$router.push("/Dashboard-Admin");
          this.sMsg = this.message;
        }

        else {
          var msg= await response.json() 
          this.eMsg = msg['message'];
        }
      } catch (error) {
        console.error(error);
        this.eMsg = 'Error updating service.';
      }
    },
  },
};

export default addService;