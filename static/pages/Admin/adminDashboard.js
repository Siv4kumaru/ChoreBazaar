import commonTable from "../../components/commonTable.js";

const adminDashboard ={
    template:`
    <div>
    
    
    <div class="container mt-5">
    <div v-if="pdfE" class="alert alert-danger" role="alert">
    {{pdfE}}
    </div>
    <div v-if="pdfS" class="alert alert-success" role="alert">
    {{pdfS}}
    </div>

    <ul class="nav nav-tabs" id="myTabs">
    <li class="nav-item">
    <a class="nav-link active" id="tab1" data-bs-toggle="tab" href="#content1">Customer</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" id="tab2" data-bs-toggle="tab" href="#content2">Professional</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" id="tab3" data-bs-toggle="tab" href="#content3">Services</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" id="tab4" data-bs-toggle="tab" href="#content4">Requests</a>
    </li>
    <li class="nav-item" >
          <button class="nav-link" id="tab5" data-bs-toggle="tab" href="#content5" type="button" @click="Report">Report</button>
        </li>
  </ul>



</div>
    <div class="tab-content mt-3">

        <commonTable class="tab-pane fade show active" id="content1" v-if="this.columns[0]" :title="title[0]" :data="data[0]" :selector="selector[0]" :columns="columns[0]" >
            <template v-slot:actions="{ row }">
            <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
            <button class="btn btn-danger btn-sm" @click="blockCus(row)" v-if="row.active">Block</button>
            <button class="btn btn-warning btn-sm" @click="unblockCus(row)" v-if="!row.active">Unblock</button>
            </template>
        </commonTable>
        <commonTable class="tab-pane fade" id="content2" v-if="this.columns[1]" :title="title[1]" :data="data[1]" :selector="selector[1]" :columns="columns[1]">
            <template v-slot:actions="{ row }">
            <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
            <button class="btn btn-success btn-sm" @click="pdf(row)">Resume</button>
            <button class="btn btn-danger btn-sm" @click="blockPro(row)" v-if="row.active">Block</button>
            <button class="btn btn-warning btn-sm" @click="unblockPro(row)" v-if="!row.active">Unblock</button>
            </template>
        
        </commonTable>

        <commonTable class="tab-pane fade" id="content3" v-if="this.columns[2]" :title="title[2]" :data="data[2]" :selector="selector[2]" :columns="columns[2]">
        <button><a href='#/addService'>Add Service</a></button>
        <template v-slot:actions="{ row }">
            <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
            <button class="btn btn-success btn-sm" @click="edit(row)">Edit</button>
            <button class="btn btn-danger btn-sm" @click="deleteServ(row)">Delete</button>
            </template>
        </commonTable>

        <commonTable class="tab-pane fade" id="content4" v-if="this.columns[3]" :title="title[3]" :data="data[3]" :selector="selector[3]" :columns="columns[3]">
            <template v-slot:actions="{ row }">
            <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
            <button class="btn btn-success btn-sm" @click="editR(row)">Edit</button>
            <button class="btn btn-danger btn-sm" @click="deleteRequest(row)">Delete</button>
            </template>
        </commonTable>
    <div class="tab-pane fade" id="content5" >
            <div v-if="iswaiting" class="alert alert-info d-flex align-items-center">
        <div class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
        <span>Waiting for the download to complete...</span>
      </div>
      <div v-else class="alert alert-success d-flex align-items-center">
        <i class="bi bi-check-circle-fill me-2"></i>
        <span>Downloaded successfully!</span>
    </div>
        </div>
        </div>
        
        <!-- view Modal -->
            <div class="modal fade" id="viewModal" tabindex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="viewModalLabel">Row Details</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div v-for="(value, key) in viewRow" :key="key">
                                <strong>{{ key }}:</strong> {{ value }}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>`,
    data() {
        return {
            selector:[],
            title:[],
            data:[],
            columns:[],
            viewRow: {},
            pdfS:'',
            pdfE:'',
            iswaiting:false,

        };
    },
    methods: {
        async Report(){
            this.iswaiting=true
            const res= await fetch('/csv')
            if(res.ok){
              const data=await res.json();
              if (res.ok){
                const taskId = data['task_id'];
                const intv= setInterval(async () => {
                  const csv_down= await fetch(`/get_csv/${taskId}`);
                  if(csv_down.ok){
                    this.iswaiting=false;
                    clearInterval(intv);
                    const blob = await csv_down.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'AllServiceRequests.csv';
                    document.body.appendChild(a);
                    a.click();
                    
                    // Cleanup
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  }
                }, 1000);
              }
            }
        },
        async pdf(row){


            const downloadUrl = `${window.location.origin}/download_pdf/${row.email}`;
            const res= await fetch(downloadUrl)
            if(!res.ok){
                console.error('Network response was not ok');
                this.pdfE="Error in downloading pdf";
                setTimeout(() => {
                    this.pdfE = "";  // Hide error message after 5 seconds
                }, 3000);
                return;
            }
            // Create a temporary anchor element to trigger the download
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = true;  // This ensures the browser knows to download the file
            document.body.appendChild(a);
            a.click();  // Simulate click on the anchor tag
            document.body.removeChild(a);
            this.pdfS=`downloaded ${row.email} resume successfully`; 
            setTimeout(() => {
                this.pdfS = "";  // Hide error message after 5 seconds
            }, 5000);
            return;
            



            
        },
        editR(row) {
            this.$router.push({ name: 'editRequest', params:{ id: row.id }});
        },
        edit(row) {
            // Redirect to the edit page, passing the row's ID as a query parameter
            this.$router.push({ name: 'editService', params: { id: row.id } });
        },
        view(row) {
            this.viewRow = { ...row }; // Copy row data
            // Remove 'id' from viewRow if it exists
            for (let v in this.viewRow) {
                console.log(`${v}: ${this.viewRow[v]}`);
                if ((v.includes('id')) || (v.includes('Id'))) {
                    delete this.viewRow[v];
                }
            }
            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('viewModal'));
            modal.show();
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
                    // Find the index of the row in the relevant data array and remove it
                    const tableIndex = 3; // Adjust this according to which table you're modifying
                    const index = this.data[tableIndex].findIndex(item => item.id === row.id);
                    if (index !== -1) {
                        this.data[tableIndex].splice(index, 1); // Remove the row from the array
                    }

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
                // Find the index of the row in the relevant data array and remove it
                const tableIndex = 2; // Adjust this according to which table you're modifying
                const index = this.data[tableIndex].findIndex(item => item.id === row.id);
                if (index !== -1) {
                    this.data[tableIndex].splice(index, 1); // Remove the row from the array
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
        },

        async blockCus(row) {       
            fetch(`api/block/${row.id}`, {
                method: 'get',
                headers:{
                    "Content-Type": "application/json",
                    "Authentication-token":sessionStorage.getItem("token")
                }, 
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
                

            })
            .then(data => {
                console.log(data);
                
                // Find the index of the row in the relevant data array and remove it
                const tableIndex = 0; // Adjust this according to which table you're modifying
                const index = this.data[tableIndex].findIndex(item => item.id === row.id);
                if (index !== -1) {
                     this.data[tableIndex][index].active = false; // Remove the row from the array
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });

          
        },
        async unblockCus(row) {       
            fetch(`api/unblock/${row.id}`, {
                method: 'get',
                headers:{
                    "Content-Type": "application/json",
                    "Authentication-token":sessionStorage.getItem("token")
                }, 
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
                

            })
            .then(data => {
                console.log(data);
                
                // Find the index of the row in the relevant data array and remove it
                const tableIndex = 0; // Adjust this according to which table you're modifying
                const index = this.data[tableIndex].findIndex(item => item.id === row.id);
                if (index !== -1) {
                     this.data[tableIndex][index].active = true; // Remove the row from the array
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });

          
        },
        async blockPro(row) {
            try {
                const response = await fetch(`api/block/${row.proUserId}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-token": sessionStorage.getItem("token")
                    }
                });
        
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
        
                const data = await response.json();
                console.log(data); // Check the response data for any error or success message
        
                // Find the index of the row in the relevant data array and update it
                const tableIndex = 1; // Adjust this according to which table you're modifying
                const index = this.data[tableIndex].findIndex(item => item.proid === row.proid);
                console.log(index);
                if (index !== -1) {
                    this.data[tableIndex][index].active = false; // Set the active status to false
                }
            } catch (error) {
                console.error('Error blocking professional:', error);
            }
        },
        
        async unblockPro(row) {
            try {
                const response = await fetch(`api/unblock/${row.proUserId}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-token": sessionStorage.getItem("token")
                    }
                });
        
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
        
                const data = await response.json();
                console.log(data); // Check the response data for any error or success message
        
                // Find the index of the row in the relevant data array and update it
                const tableIndex = 1; // Adjust this according to which table you're modifying
                const index = this.data[tableIndex].findIndex(item => item.proid === row.proid);
                if (index !== -1) {
                    this.data[tableIndex][index].active = true; // Set the active status to true
                }
            } catch (error) {
                console.error('Error unblocking professional:', error);
            }
        },
      },

    async mounted() {
        //bootstrap tab
        const tabs = new bootstrap.Tab(document.querySelector('#tab1'));
        tabs.show(); // Show the first tab on page load
    
        // This part ensures that when a tab is clicked, it switches its content accordingly
        document.querySelectorAll('.nav-link').forEach(tab => {
          tab.addEventListener('click', function (event) {
            const targetContent = document.querySelector('#content' + tab.id.slice(-1));
            document.querySelectorAll('.tab-pane').forEach(content => {
              content.classList.remove('show', 'active');
            });
            targetContent.classList.add('show', 'active');
          });
        });

        console.log("mounted");

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
                { "data": `active`, "title": "Active Status" },
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
                { "data": "active", "title": "Active Status" },
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
                { "data": "custemail", "title": "Customer Email" },
                { "data": "proemail", "title": "Professional Email" },
                { "data": "serviceName", "title": "Service" },
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