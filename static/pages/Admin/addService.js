const addService = {
  template: `
  <p v-if="message" class="mt-3 text-center">{{ message }}</p>
    <div class="container mt-5">
    {{service.image}}
  <h1 class="text-center mb-4">Add Service</h1>
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
    <div class="mb-3">
      <label for="image" class="form-label">Image:</label>
<input type="file" id="image" accept="image/*" @change="handleFileUpload" class="form-control" required />    </div>
    <button type="submit" class="btn" style="background-color: #FAC012; color: white;">Add Service</button>
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
            image: null,
          },
        message: '',
      };
    },
    methods: {
      handleFileUpload(event) {
        const file = event.target.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          alert("File size exceeds the 5MB limit.");
          event.target.value = ""; // Clear the input if file is too large
          this.service.image = null;
        } else {
          this.service.image = file;
        }
      },

      // Fetch the service details
      // Update the service using PATCH
      async AddService() {
        const serviceId = this.$route.params.id;
        console.log(this.service.image);
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