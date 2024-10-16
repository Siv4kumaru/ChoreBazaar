const addService = {
    template: `
      <div>
        <h1>Add Service</h1>
        <form @submit.prevent="AddService">
          <div>
            <label for="name">Service Name:</label>
            <input v-model="service.name" type="text" id="name" required />
          </div>
          <div>
            <label for="description">Description:</label>
            <textarea v-model="service.description" id="description" required></textarea>
          </div>
          <div>
            <label for="price">Price:</label>
            <input v-model="service.price" type="number" id="price" required />
          </div>
          <button type="submit">Add Service</button>
        </form>
        <p v-if="message">{{ message }}</p>
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
        message: '',
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
            this.message = 'Service added successfully.';
            console.log(this.message);
            this.$router.push("/Dashboard-Admin");
          }
  
          if (!response.ok) {
            throw new Error("Error updating service");
          }
          const data = await response.json();
          this.message = data.message;
        } catch (error) {
          console.error(error);
          this.message = 'Error updating service.';
        }
      },
    },
  };
  
  export default addService;