import services from "../../components/services.js";
import changedCommonTable from "../../components/changedCommonTable.js"; 
import star from "../../components/star.js";
const custDashboard = {
  template:`<div>
    <h1>Customer Dashboard</h1>
    <button class="btn btn-primary" @click='history'>history</button>
      <div class="d-flex flex-row justify-content-center">
        <div v-for="service in allServices">
        <services :name="service.name" :description="service.description" :price="service.price" ></services>
        </div>
      </div>
<div v-if="data[0] && data[0][0]">
  <!-- can also use (row) => row.approve === 'Pending' arrow function in condition , here in condition isPending without paranthesis is just passing a reference the function rather than actually invoking with paranthesis and all, no paranthesis function means reference being passed-->
  <changedCommonTable  :condition="Pending"  :title="title[0]" :data="data[0]" :selector="selector[0]" :columns="columns[0]">
        <template v-slot:actions="{ row }">
                <button  class="btn btn-success btn-sm" @click="openFeedbackModal(row)">Completed</button>

        <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
        <button v-if="row.serviceStatus!='Customer Cancellation'" class="btn btn-danger btn-sm" @click="cancel(row)">Cancel</button>
        </template>
  </changedCommonTable>
    <changedCommonTable  :condition="Accepted"  title='Accepted/Ongoing' :data="data[0]" :selector="selector[0]" :columns="columns[1]">
        <template v-slot:actions="{ row }">
        <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
        <button  class="btn btn-success btn-sm" @click="openFeedbackModal(row)">Completed</button>
        <button  class="btn btn-danger btn-sm" @click="notCompleted(row)">Not Completed</button>
        </template>
  </changedCommonTable>
  <changedCommonTable  :condition="Rejected"  title='Rejected/Cancelled' :data="data[0]" :selector="selector[0]" :columns="columns[0]">
        <template v-slot:actions="{ row }">
        <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
        <button v-if="row.serviceStatus!='Customer Cancellation'" class="btn btn-danger btn-sm" @click="cancel(row)">Cancel</button>
        </template>
  </changedCommonTable>

</div>

      <!-- Feedback Modal -->
      <div class="modal fade" id="feedbackModal" tabindex="-1" aria-labelledby="feedbackModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="feedbackModalLabel">Feedback</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="submitFeedback">
                <label for="star" class="form-label">Rating</label>
                <star></star>

                <div class="mb-3">
                  <label for="remark" class="form-label">Remark</label>
                  <textarea class="form-control" v-model="remark" rows="3" required></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="submitFeedback">Submit</button>
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
      columns:[],
      rating: null,
      remark: "",
      currentRow: null,
    };
  },
  methods:{
    hi(){
      console.log("hi");
    },
    history(){
      this.$router.push({ name: 'historyC', params:{ data:JSON.stringify(this.data),columns:JSON.stringify(this.columns)}});
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
      async cancel(row){
          const res = await fetch(window.location.origin + "/api/requests", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authentication-token": sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
              id: row.id,
              appprove: "Customer Cancellation",
              serviceStatus: "Customer Cancellation",
            })
          });
          if (res.ok) {
            console.log("Request cancelled");
            var ponse= await res.json();
            console.log(ponse);
            const tableIndex = 0; // Adjust this according to which table you're modifying
            const index = this.data[tableIndex].findIndex(item => item.id === row.id);
            if (index !== -1) {
                this.data[tableIndex][index].serviceStatus="Customer Cancellation"; // Remove the row from the array
            }
          } else {
            console.error("Error cancelling request", res.status);
          }
      },

      openFeedbackModal(row) {
        this.currentRow = row;
        $("#feedbackModal").modal("show");
      }, 
      async submitFeedback() {
        console.log(this.rating);
        if (!this.rating) {
          alert("Please select a rating");
          return;}
        if (!this.currentRow) return;
        const res = await fetch(window.location.origin + "/api/requests", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authentication-token": sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            id: this.currentRow.id,
            serviceStatus: "Completed",
            rating: this.rating,
            feedback: this.remark,
          }),
        });
        console.log(this.rating);
        if (res.ok) {
          console.log("Request completed successfully");
          const response = await res.json();
          console.log(response);
          const tableIndex = 0;
          const index = this.data[tableIndex].findIndex((item) => item.id === this.currentRow.id);
          if (index !== -1) {
            this.data[tableIndex][index].serviceStatus = "Completed";
          }
          // Reset feedback form
          this.rating= null;
          this.remark= "" ;
          $("#feedbackModal").modal("hide");
        } else {
          console.error("Error completing request", res.status);
        }
      },
    async  notCompleted(row){
      const res = await fetch(window.location.origin + "/api/requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authentication-token": sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          id: row.id,
          serviceStatus: "Not Completed",
        })
      });
      if (res.ok) {
        console.log("Request status: Not completed");
        var ponse= await res.json();
        console.log(ponse);
        const tableIndex = 0; // Adjust this according to which table you're modifying
        const index = this.data[tableIndex].findIndex(item => item.id === row.id);
        if (index !== -1) {
            this.data[tableIndex][index].serviceStatus="Customer Cancellation"; // Remove the row from the array
        }
      } else {
        console.error("Error cancelling request", res.status);
      }
  },
  },      

  async mounted() {
    const ratingGroup = document.querySelector('.rating-group');
    const self = this; // store reference to Vue component instance
    ratingGroup.addEventListener('change', function(event) {
        if (event.target.classList.contains('rating__input')) {
            self.rating = event.target.value; // use self instead of this
            console.log(self.rating);
        }
    });
    
    var clean=[];
    try {
      const res = await fetch(window.location.origin + "/api/services", {
        headers: {
          "Authentication-token": sessionStorage.getItem("token"),
        },
      });
      if (res.ok) {
        const data = await res.json();
        this.allServices = data;
      } else {
        console.error("Error fetching services", res.status);
      }
   
      const res2 = await fetch(window.location.origin + "/api/requests", {
        headers: {
          "Authentication-token": sessionStorage.getItem("token"),
        },
      });
      if (res2.ok) {
        var data2 = await res2.json();
        console.log(data2); 
        for (let i in data2) {

          if (data2[i]["custemail"] == sessionStorage.getItem("email")) {
            const proName = await fetch(window.location.origin + "/api/professional/" + data2[i]["proemail"], {
              headers: {
                "Authentication-token": sessionStorage.getItem("token"),
              },  
            });
            if (proName.ok) {
              clean.push(data2[i]);
              const proData = await proName.json();
              data2[i]["proName"] = proData["name"];
            } else {
              data2[i]["proName"] = "Not Available";
            }
            
            
          }

        }
        this.columns.push([
          { data: "proemail", title: "Professional Email" },
          { data: "proName", title: "Professional Name" },
          { data: "serviceName", title: "Service Name" },
          { data: "dateofrequest", title: "Date of Request" },
          { data: "servicePrice", title: "Service Price" },
          { data: "approve", title: "Approved" },
        ]);
        this.columns.push([
          { data: "proemail", title: "Professional Email" },
          { data: "proName", title: "Professional Name" },
          { data: "serviceName", title: "Service Name" },
          { data: "dateofrequest", title: "Date of Request" },
          {data: "dateofcompletion", title: "Date of Completion"},
          { data: "servicePrice", title: "Service Price" },
          { data: "approve", title: "Approved" },
        ]);


        this.data.push(clean);   
         
        this.title.push("Pending Requests");
        this.selector.push("Ongoing Requests");
      } else {
        console.error("Error fetching requests", res2.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
   },
   
  components: { services, changedCommonTable,star },
};
export default custDashboard;