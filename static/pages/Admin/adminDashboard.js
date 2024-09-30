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
                <button class="btn btn-success btn-sm" @click="editService(row)">Edit</button>
                <button class="btn btn-danger btn-sm" @click="deleteServ(row)">Delete</button>
                </template>
            </commonTable>

            <commonTable v-if="this.columns[3]" :title="title[3]" :data="data[3]" :selector="selector[3]" :columns="columns[3]">
                <template v-slot:actions="{ row }">
                <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
                <button class="btn btn-danger btn-sm" @click="deleteRequest(row)">Delete</button>
                </template>
            </commonTable>

            <!-- Edit Service Modal -->
                <div class="modal fade" id="editServiceModal" tabindex="-1" aria-labelledby="editServiceModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="editServiceModalLabel">Edit Service</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form @submit.prevent="updateService">
                                    <div class="mb-3">
                                        <label for="serviceName" class="form-label">Service Name</label>
                                        <input type="text" class="form-control" id="serviceName" v-model="editService.name" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="serviceDescription" class="form-label">Description</label>
                                        <textarea class="form-control" id="serviceDescription" v-model="editService.description" required></textarea>
                                    </div>
                                    <div class="mb-3">
                                        <label for="servicePrice" class="form-label">Price</label>
                                        <input type="number" class="form-control" id="servicePrice" v-model="editService.price" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary">Update Service</button>
                                </form>
                            </div>
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
            </div>`,
        data() {
            return {
                selector:[],
                title:[],
                data:[],
                columns:[],
                viewRow: {},
                editServicedata: {
                    id: null,
                    name: '',
                    description: '',
                    price: null,
                },
            };
        },
        methods: {

            editService(row) {
                this.editServicedata = { ...row }; // Copy row data to editService
                const modal = new bootstrap.Modal(document.getElementById('editServiceModal'));
                modal.show();
            },
            async updateService() {
                const res = await fetch(`api/services`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-token": sessionStorage.getItem("token"),
                    },
                    body: JSON.stringify(this.editServicedata),
                });
        
                if (res.ok) {
                    // Update the local data array
                    const index = this.data[2].findIndex(item => item.id === this.editServicedata.id);
                    if (index !== -1) {
                        this.data[2][index] = { ...this.editServicedata }; // Update the service in data
                    }
                    this.editServicedata = { id: null, name: '', description: '', price: null }; // Reset form
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editServiceModal'));
                    modal.hide(); // Hide the modal
                } else {
                    console.error('Failed to update service');
                }
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