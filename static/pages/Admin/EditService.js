
  const EditService={
  templates:`<div>
    <h2>Edit Row</h2>
    <!-- Form to edit the row data -->
    <form @submit.prevent="submitEdit">
      <div v-for="(value, key) in editData" :key="key">
        <label>{{ key }}:</label>
        <input v-model="editData[key]" type="text" :disabled="key === 'id'" />
      </div>
      <button type="submit" class="btn btn-success">Save Changes</button>
    </form>
  </div>
`,


  data() {
    return {
      editData: {}
    };
  },
  mounted() {
    // Fetch the row data using the id from route params
    const id = this.$route.params.id;
    fetch(`/api/services`) // Example API endpoint
      .then(response => response.json())
      .then(data => {
        this.editData = data;
      })
      .catch(error => {
        console.error('Error fetching row data:', error);
      });
  },
  methods: {
    submitEdit() {
      // Send updated data to the server
      fetch(`/api/services/${this.editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify(this.editData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Edit successful:', data);
        // Navigate back to the dashboard after editing
        this.$router.push({ name: 'adminDashboard' });
      })
      .catch(error => {
        console.error('Error submitting edit:', error);
      });
    }
  },
};

export default EditService;

