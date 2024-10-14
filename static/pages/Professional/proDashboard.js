import changedCommonTable from "../../components/changedCommonTable.js"; 

const proDashboard = {
  template:`<div>
    <h1>Professional Dashboard</h1>
    <button class="btn btn-primary" @click='history'>history</button>
<div v-if="data[0]">
  <!-- can also use (row) => row.approve === 'PendingOrAccepted' arrow function in condition , here in condition isPending without paranthesis is just passing a reference the function rather than actually invoking with paranthesis and all, no paranthesis function means reference being passed-->
  <changedCommonTable  :condition="Pending"  title="Pending" :data="data" :selector="selector[0]" :columns="columns[0]">
        <template v-slot:actions="{ row }">
        <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
        <button class="btn btn-success btn-sm" @click="accept(row)">Accept</button>
        <button  class="btn btn-danger btn-sm" @click="cancel(row)">Reject</button>
        </template>
  </changedCommonTable>
    <changedCommonTable  :condition="Accepted"  :title="title[0]" :data="data" :selector="selector[0]" :columns="columns[1]">


    <template v-slot:actions="{ row }">
    <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
        <button  class="btn btn-danger btn-sm" @click="cancel(row)">Reject</button>
        </template>
  </changedCommonTable>
  <changedCommonTable  :condition="Rejected"  title='Rejected/Cancelled' :data="data" :selector="selector[0]" :columns="columns[0]">
        <template v-slot:actions="{ row }">
        <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
        <button v-if="row.serviceStatus!='Customer Cancellation'" class="btn btn-success btn-sm" @click="accept(row)">Accept</button>
        </template>
  </changedCommonTable>

</div>
<!-- DOC Modal -->
<div class="modal fade" id="dateModal" tabindex="-1" aria-labelledby="dateModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="dateModalLabel">Enter Date and Time</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="dateForm">
                    <div class="mb-3">
                        <label for="dateTimeInput" class="form-label">Date and Time</label>
                        <input type="datetime-local" class="form-control" id="dateTimeInput" required
                               min="1900-01-01T00:00" max="2099-12-31T23:59">
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    </div>
</div>



    </div>
  `,  
  data() {
    return {
      allServices: [],
      columns:[],
      title:[],
      data:[],
      selector:[],
      columns:[]
    };
  },
  methods:{
    hi(){
      console.log("hi");
    },
    
    history(){
    console.log(this.data);
      this.$router.push({ name: 'historyP', params:{ data:JSON.stringify( this.data),columns:JSON.stringify(this.columns)}});
    },
    Pending(row) {
      return row.approve === 'Pending' && row.serviceStatus != 'Customer Cancellation' ;
    },
    Accepted(row) {
      return row.approve === 'accepted' && row.serviceStatus != 'Completed';
    },
    Rejected(row) {
      return row.serviceStatus === 'Customer Cancellation' || row.approve === 'Rejected';
    },
    async accept(row) {
      // Show the modal directly
      $('#dateModal').modal('show');
  
      // Handle form submission
      $('#dateForm').off('submit').on('submit', async function (event) {
          event.preventDefault(); // Prevent traditional form submission
  
          const dateTimeValue = $('#dateTimeInput').val();
           // Get date and time input value in format YYYY-MM-DDTHH:MM
          console.log('Selected Date and Time:', dateTimeValue);  // Log the selected date and time
           const formattedDateTime = this.formatDateTime(dateTimeValue); // Format it to YYYY-MM-DD HH:MM:SS
          console.log('Selected formatted Date and Time:', formattedDateTime);  // Log the formatted date and time
  
          $('#dateModal').modal('hide');  // Hide the modal after submission
  
          // Proceed with the PATCH request to update the row's status
          const res = await fetch(window.location.origin + "/api/requests", {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json",
                  "Authentication-token": sessionStorage.getItem("token"),
              },
              body: JSON.stringify({
                  id: row.id,
                  approve: "accepted",
                  serviceStatus: "Ongoing",
                  dateofcompletion: formattedDateTime  // Include the formatted date and time in the request
              })
          });
          if (res.ok) {
              console.log("Request Accepted");
              const response = await res.json();
              console.log(response);
  
              // Update the row in the `data` array
              const index = this.data.findIndex(item => item.id === row.id);
              if (index !== -1) {
                  this.data[index].approve = "accepted"; // Update approval status
                  this.data[index].dateofcompletion = formattedDateTime; // Add completion date and time
              }
          } else {
              console.error("Error accepting request", res.status);
          }
      }.bind(this)); // Bind 'this' so that Vue's instance remains accessible
  },
  
  // Function to format date and time
  formatDateTime(dateTimeValue) {
      const date = new Date(dateTimeValue);
      // Extract date and time components
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero to month
      const day = String(date.getDate()).padStart(2, '0');        // Add leading zero to day
      const hours = String(date.getHours()).padStart(2, '0');      // Add leading zero to hours
      const minutes = String(date.getMinutes()).padStart(2, '0');  
      // Add leading zero to minutes

  
      // Combine into the desired format
      return `${year}-${month}-${day} ${hours}:${minutes}`;
  },
  
  
      async cancel(row){
          const res = await fetch(window.location.origin + "/api/requests", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authentication-token": sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
              id: row.id,
              approve: "Rejected",
              serviceStatus: "Professional Rejection",
            })
          });
          if (res.ok) {
            console.log("Request Rejected");
            var ponse= await res.json();
            console.log(ponse);
            const index = this.data.findIndex(item => item.id === row.id);
            if (index !== -1) {
                this.data[index].approve="Rejected"; // Remove the row from the array
            }
          } else {
            console.error("Error cancelling request", res.status);
          }
      }
  },
  async mounted() {
    try {

   
      const res2 = await fetch(window.location.origin + "/api/requests", {
        headers: {
          "Authentication-token": sessionStorage.getItem("token"),
        },
      });
      if (res2.ok) {
        var data2 = await res2.json();
        console.log(data2); 
        for (let i in data2) {
          if (data2[i]["proemail"] == sessionStorage.getItem("email")) {

            this.data.push(data2[i]);

            
          }


        }
        this.columns.push([
          { data: "custemail", title: "Customer Email" },
          { data: "customerName", title: "Customer Name" },
          { data: "serviceName", title: "Service Name" },
          { data: "dateofrequest", title: "Date of Request" },
          { data: "servicePrice", title: "Service Price" },
          { data: "approve", title: "Approved" },
          { data: "serviceStatus", title: "Service Status" },
        ]);
        this.columns.push([
          { data: "custemail", title: "Customer Email" },
          { data: "customerName", title: "Customer Name" },
          { data: "serviceName", title: "Service Name" },
          { data: "dateofrequest", title: "Date of Request" },
          {data: "dateofcompletion", title: "Date of Completion"},
          { data: "servicePrice", title: "Service Price" },
          { data: "approve", title: "Approved" },
          { data: "serviceStatus", title: "Service Status" },
        ]);


         
        this.title.push("Ongoing  Requests");
        this.selector.push("Ongoing Requests");
      } else {
        console.error("Error fetching requests", res2.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
   },
   
  components: {  changedCommonTable },
};
export default proDashboard;