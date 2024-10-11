import services from "../../components/services.js";
import changedCommonTable from "../../components/changedCommonTable.js"; 

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
  <!-- can also use (row) => row.approve === 'PendingOrAccepted' arrow function in condition , here in condition isPending without paranthesis is just passing a reference the function rather than actually invoking with paranthesis and all, no paranthesis function means reference being passed-->
  <changedCommonTable  :condition="PendingOrAccepted"  :title="title[0]" :data="data[0]" :selector="selector[0]" :columns="columns[0]">
        <template v-slot:actions="{ row }">
        <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
        <button v-if="row.approve!='Customer Cancellation'" class="btn btn-danger btn-sm" @click="cancel(row)">Cancel</button>
        </template>
  </changedCommonTable>
  <changedCommonTable  :condition="Rejected"  title='Rejected/Cancelled' :data="data[0]" :selector="selector[0]" :columns="columns[0]">
        <template v-slot:actions="{ row }">
        <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
        <button v-if="row.approve!='Customer Cancellation'" class="btn btn-danger btn-sm" @click="cancel(row)">Cancel</button>
        </template>
  </changedCommonTable>

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
      this.$router.push({ name: 'historyC', params:{ data:JSON.stringify(this.data),columns:JSON.stringify(this.columns)}});
    },
    PendingOrAccepted(row) {
      return row.approve === 'accepted' || row.approve === 'Pending';
    },
    Rejected(row) {
      return row.approve === 'Customer Cancellation' || row.approve === 'Rejected';
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
              approve: "Customer Cancellation",
            })
          });
          if (res.ok) {
            console.log("Request cancelled");
            var ponse= await res.json();
            console.log(ponse);
            const tableIndex = 0; // Adjust this according to which table you're modifying
            const index = this.data[tableIndex].findIndex(item => item.id === row.id);
            if (index !== -1) {
                this.data[tableIndex][index].approve="Customer Cancellation"; // Remove the row from the array
            }
          } else {
            console.error("Error cancelling request", res.status);
          }
      }
  },
  async mounted() {
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
          { data: "approve", title: "Approved" },
        ]);


        this.data.push(clean);   
         
        this.title.push("Ongoing  Requests");
        this.selector.push("Ongoing Requests");
      } else {
        console.error("Error fetching requests", res2.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
   },
   
  components: { services, changedCommonTable },
};
export default custDashboard;