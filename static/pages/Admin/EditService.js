const EditService = {
  template: `
    <div>
      <h1>Edit Service</h1>
      <form @submit.prevent="updateService">
        <div>
          <label for="custE">Customer Email:</label>
          <input v-model="service.custE" type="text" id="custE" required />
        </div>
        <div>
          <label for="description">Description:</label>
          <textarea v-model="service.description" id="description" required></textarea>
        </div>
        <div>
          <label for="price">Price:</label>
          <input v-model="service.price" type="number" id="price" required />
        </div>
        <button type="submit">Update Service</button>
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
  created() {
    this.fetchService();
  },
  methods: {
    // Fetch the service details
    async fetchService() {
      const serviceId = this.$route.params.id;
      console.log(serviceId) // Assuming the service ID is passed in the route
      try {
        const response = await fetch(`/api/services/${serviceId}`
          ,{headers:{
            "Content-Type": "application/json",
            "Authentication-token":sessionStorage.getItem("token")
      }},
        );
        if (!response.ok) {
          throw new Error("Error fetching service details");
        }
        const data = await response.json();
        this.service = data;
      } catch (error) {
        console.error(error);
        this.message = 'Error fetching service details.';
      }
    },

    // Update the service using PATCH
    async updateService() {
      const serviceId = this.$route.params.id;
      try {
        const response = await fetch('/api/services', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            "Authentication-token":sessionStorage.getItem("token")
          },
          body: JSON.stringify({
            "id": serviceId,
            "name": this.service.name,
            "description": this.service.description,
            "price": this.service.price,
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
        const data = await response.json();
        this.message = data.message;
      } catch (error) {
        console.error(error);
        this.message = 'Error updating service.';
      }
    },
  },
};

export default EditService;