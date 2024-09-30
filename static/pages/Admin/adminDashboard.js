    import commonTable from "../../components/commonTable.js";

    const adminDashboard ={
        template:`
        <div>
            <commonTable v-if="this.columns[0]" :title="title[0]" :data="data[0]" :selector="selector[0]" :columns="columns[0]" >
                <template v-slot:actions="{ row }">
                <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
                <button class="btn btn-danger btn-sm" @click="blockUser(row.id)">Block</button>
                <button class="btn btn-warning btn-sm" @click="unblockUser(row.id)">Unblock</button>
                </template>
            </commonTable>

            <commonTable v-if="this.columns[1]" :title="title[1]" :data="data[1]" :selector="selector[1]" :columns="columns[1]">
                <template v-slot:actions="{ row }">
                <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
                <button class="btn btn-danger btn-sm" @click="blockUser(row.id)">Block</button>
                <button class="btn btn-warning btn-sm" @click="unblockUser(row.id)">Unblock</button>
                </template>
            </commonTable>

            <commonTable v-if="this.columns[2]" :title="title[2]" :data="data[2]" :selector="selector[2]" :columns="columns[2]">
                <template v-slot:actions="{ row }">
                <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
                <button class="btn btn-danger btn-sm" @click="deleteServ(row)">Delete</button>
                </template>
            </commonTable>

            <commonTable v-if="this.columns[3]" :title="title[3]" :data="data[3]" :selector="selector[3]" :columns="columns[3]">
                <template v-slot:actions="{ row }">
                <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
                <button class="btn btn-danger btn-sm" @click="deleteRequest(row)">Delete</button>
                </template>
            </commonTable>
            </div>`,
        data() {
            return {
                selector:[],
                title:[],
                data:[],
                columns:[],
            };
        },
        methods: {
            view(row){
                console.log(row);
                
            },
            
            deleteRequest(row) {
                    
                    fetch(`api/requests`, {
                        method: 'delete',
                        headers:{
                            "Content-Type": "application/json",
                            "Authentication-token":sessionStorage.getItem("token")
                        }, 
                        body: JSON.stringify({ "id": row.id })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                        
    
                    })
                    .then(data => {
                        console.log(data);

                    })
                    .catch(error => {
                        console.error('There has been a problem with your fetch operation:', error);
                    });
            },

            deleteServ(row) {

                fetch(`api/services`, {
                    method: 'delete',
                    headers:{
                        "Content-Type": "application/json",
                        "Authentication-token":sessionStorage.getItem("token")
                    }, 
                    body: JSON.stringify({ "id": row.id })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                    

                })
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
            },

            async blockUser(id) {
                const resB=await fetch(`api/block/${id}`, {
                  method: 'GET',
                  headers:{
                    "Authentication-token":sessionStorage.getItem("token")
                }, 
                });
                
                  if (resB.ok) {
                    // If the request was successful (status code 200-299), parse the response
                    return console.log(resB.json());
                  } else {
                    // If the response was not OK, handle the error
                    return resB.json().then(errorData => {
                      throw new Error(errorData.message || "Something went wrong");
                    });
                  }

              
            },
            async unblockUser(id) {
                const resUB=await fetch(`api/unblock/${id}`, {
                  method: 'GET',
                  headers:{
                    "Authentication-token":sessionStorage.getItem("token")
                }, 
                });
                
                  if (resUB.ok) {
                    // If the request was successful (status code 200-299), parse the response
                    return console.log(resUB.json());
                  } else {
                    // If the response was not OK, handle the error
                    return resUB.json().then(errorData => {
                      throw new Error(errorData.message || "Something went wrong");
                    });
                  }

              
            },
          },

        async mounted() {

            

            const res=await fetch(window.location.origin+`/api/customer`,{
                method: "GET", 
                headers:{
                    "Authentication-token":sessionStorage.getItem("token")
                }, 
            });
            
            const res2=await fetch(window.location.origin+`/api/professional`,{
                method: "GET", 
                headers:{
                    "Authentication-token":sessionStorage.getItem("token")
                }, 
            });

            const res3=await fetch(window.location.origin+`/api/services`,{
                method: "GET", 
                headers:{
                    "Authentication-token":sessionStorage.getItem("token")
                }, 
            });

            const res4=await fetch(window.location.origin+`/api/requests`,{
                method: "GET", 
                headers:{
                    "Authentication-token":sessionStorage.getItem("token")
                }, 
            });
            function hi(){
                console.log("hi");
            }
            if (res.ok) {
                const data1 = await res.json();
                this.data.push(data1);
                this.selector.push("table1");
                this.title.push("Customers");
                this.columns.push([
                    { "data": "name", "title": "Name" },
                    { "data": "email", "title": "Email" },
                    { "data": "phone", "title": "Phone" },
                    { "data": "address", "title": "Address" },
                    { "data": "pincode", "title": "Pincode" }, 
                    ]);
            }
            else {
                this.data.push(null);
                this.selector.push(null);
                this.title.push(null);
                this.columns.push(null);
            }

            
            if (res2.ok) {
                const data2 = await res2.json();
                this.data.push(data2);
                this.selector.push("table2");
                this.title.push("Professionals");
                this.columns.push([
                    { "data": "name", "title": "Name" },
                    { "data": "email", "title": "Email" },
                    { "data": "phone", "title": "Phone" },
                    { "data": "address", "title": "Address" },
                    { "data": "pincode", "title": "Pincode" },
                    { "data":"serviceName","title":"ServiceName" },
                    { "data": "experience", "title": "Experience" },

                ]);
            }
            else {
                this.data.push(null);
                this.selector.push(null);
                this.title.push(null);
                this.columns.push(null);
            }


            if (res3.ok) {
                const data3 = await res3.json();
                this.data.push(data3);
                this.selector.push("table3");
                this.title.push("Services");
                this.columns.push([
                    { "data": "name", "title": "Name" },
                    { "data": "description", "title": "Description" },
                    { "data": "price", "title": "Price" },
                ]);
            }
            else {
                this.data.push(null);
                this.selector.push(null);
                this.title.push(null);
                this.columns.push(null);
            }

            if (res4.ok) {
                const data4 = await res4.json();
                this.data.push(data4);
                this.selector.push("table4");
                this.title.push("Requests");
                this.columns.push([
                        { "data": "dateofrequest", "title": "Date of Request" },
                    { "data": "dateofcompletion", "title": "date of Completion" },
                    { "data": "serviceStatus", "title": "Service Status" },
                    { "data": "feedback", "title": "FeedBack" },
                ]);
            }
            else {
                this.data.push(null);
                this.selector.push(null);
                this.title.push(null);
                this.columns.push(null);
            }


        },
        components: { commonTable },
    }

    export default adminDashboard;