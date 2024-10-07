import services from "../../components/services.js";
import commonTable from "../../components/commonTable.js"; 

const custDashboard = {
  template:`<div>
    <h1>Customer Dashboard</h1>
      <div class="d-flex flex-row justify-content-center">
         <div v-for="service in allServices"  >
        <services :name="service.name" :description="service.description" :price="service.price"></services>
      </div>
      </div>
      <commonTable v-if="this.columns[0]" :title="title[0]" :data="data[0]" :selector="selector[0]" :columns="columns[0]" >
          <template v-slot:actions="{ row }">
          <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
          <button class="btn btn-danger btn-sm" @click="blockCus(row)" v-if="row.active">Block</button>
          <button class="btn btn-warning btn-sm" @click="unblockCus(row)" v-if="!row.active">Unblock</button>
          </template>
      </commonTable>
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
  async mounted() {
    const res=await fetch(window.location.origin+"/api/services",{
      headers:{
        "Authentication-token":sessionStorage.getItem("token")
      }
    });
    const res2=await fetch(window.location.origin+"/api/requests",{
      headers:{
        "Authentication-token":sessionStorage.getItem("token")
        //name,email,phone,address,pincode, 
      } 
    });
    if (res.ok) {
    const data = await res.json();
    this.allServices = data;
    console.log(this.allServices);  
    }
    if (res2.ok) {
      const data2 = await res2.json();
      for(let i in data2){
      if(data2[i]['custemail']==sessionStorage.getItem("email")){
          console.log(data2);
          const proName=await fetch(window.location.origin+"/api/professional/"+data2[i]['proemail'],{
            headers:{
              "Authentication-token":sessionStorage.getItem("token")
            }
          });
          if(proName.ok){
            const proData=await proName.json();
            data2[i]['proName']=proData['name'];
          }
          else{
            data2[i]['proName']="Not Available";
          } 
          
          this.columns.push([
            {"data":"proemail","title":"Professional Email"},
            {"data":"proName","title":"proName"},
            {"data":"serviceName","title":"ServiceName"},
            {"data":"dateofrequest","title":"Date of Request"},
            {"data":"approve","title":"Approved"}
            ]);
          this.title.push("Requests");
          this.data.push(data2);  
          this.selector.push("professional");
        }}

    }
  },
  components: { services, commonTable },
};
export default custDashboard;