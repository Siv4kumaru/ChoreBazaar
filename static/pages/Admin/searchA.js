import commonTable from "../../components/commonTable.js";

const searchA = {
    template:`
    <div>
        <br>    
        <select v-model="selectedType"  id="searchType" @change="cat()" >
            <option :value="s" v-for="s in searchType">{{s}}</option>
        </select>
        <input v-model="queryy" type="text" placeholder="Search.." id="query" name="query" @keyup="eachkey()">
        <button><i class="fa-solid fa-magnifying-glass"></i></button>
        <br>
        <br>
        <commonTable v-if="this.title=='Services'" :title="title" :data="data" :selector="selector" :columns="columns">
            <template v-slot:actions="{ row }">
            <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
            <button class="btn btn-success btn-sm" @click="edit(row)">Edit</button>
            <button class="btn btn-danger btn-sm" @click="deleteServ(row)">Delete</button>
            </template>
        </commonTable>

        <commonTable v-if="this.title=='Requests'" :title="title" :data="data" :selector="selector" :columns="columns">
            <template v-slot:actions="{ row }">
            <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
            <button class="btn btn-success btn-sm" @click="editR(row)">Edit</button>
            <button class="btn btn-danger btn-sm" @click="deleteRequest(row)">Delete</button>
            </template>
        </commonTable>

        <commonTable v-if="this.title=='Customers'" :title="title" :data="data" :selector="selector" :columns="columns">
            <template v-slot:actions="{ row }">
            <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
            <button v-if="row.active=='Not Blocked'" class="btn btn-danger btn-sm" @click="blockCus(row)">Block</button>
            <button v-else class="btn btn-warning btn-sm" @click="unblockCus(row)">Unblock</button>
            </template>
        </commonTable>

        <commonTable v-if="this.title=='Professionals'" :title="title" :data="data" :selector="selector" :columns="columns">
            <template v-slot:actions="{ row }">
            <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
            <button v-if="row.active=='Not Blocked'" class="btn btn-danger btn-sm" @click="blockPro(row)">Block</button>
            <button v-else class="btn btn-warning btn-sm" @click="unblockPro(row)">Unblock</button>
            </template>
        </commonTable>

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
    `,
    data() {
        return {
            searchType: ['customer', 'professional', 'service','service Request'],
            selectedType:'',
            queryy:'',
            data:null,
            selector:'',
            title:'',
            columns:null,
            viewRow: {}
        }
    },

    methods:{
        async eachkey(){
            var query = $("#query").val().toLowerCase();
            $("#table tbody tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(query) > -1)
              });
            console.log(query);
            if(this.selectedType==''){
                alert("Please select a search type");
                return; 
            }
        },
        async cat(){
            $("#query").val("");    
            var type = this.selectedType;
            try {
                const res = await fetch(window.location.origin + `/api/search/${type}/`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-token": sessionStorage.getItem("token"),
                    }
                });
                console.log(res);
                if (res.ok) {
                    const data = await res.json();
                    console.log(data);
                    if(data != null){
                        if(data[0].active != undefined){
                            if(data[0].active == true){
                                data[0].active = "Blocked";
                            }
                            else{
                                data[0].active = "Not Blocked";
                            }
                    }}
                    if (this.selectedType === "service") {
                        this.data=data;
                        this.selector="table";
                        this.title="Services";
                        this.columns=[
                            { "data": "name", "title": "Name" },
                            { "data": "description", "title": "Description" },
                            { "data": "price", "title": "Price" },
                        ];
                    }
                    else if(this.selectedType === "service Request"){
                        this.data=data;
                        this.selector="table";
                        this.title="Requests";
                        this.columns=[
                            { "data": "custemail", "title": "Customer Email" },
                            { "data": "proemail", "title": "Professional Email" },
                            { "data": "serviceName", "title": "Service" },
                            { "data": "dateofrequest", "title": "Date of Request" },
                            { "data": "dateofcompletion", "title": "date of Completion" },
                            { "data": "serviceStatus", "title": "Service Status" },
                            { "data": "feedback", "title": "FeedBack" },
                        ];
                    }
                    else if(this.selectedType === "customer"){
                        this.data=data;
                        this.selector="table";
                        this.title="Customers";     
                        this.columns=[
                            { "data": "email", "title": "Email" },
                            { "data": "name", "title": "Name" },
                            { "data": "phone", "title": "Phone" },
                            { "data": "address", "title": "Address" },
                            { "data": "pincode", "title": "Pincode" },
                            { "data": "active", "title": "Active" },
                        ];
                    }
                    else if(this.selectedType === "professional"){
                        this.data=data;
                        this.selector="table";
                        this.title="Professionals";     
                        this.columns=[
                            { "data": "name", "title": "Name" },
                            { "data": "email", "title": "Email" },
                            { "data": "phone", "title": "Phone" },
                            { "data": "serviceName", "title": "Service Name" },
                            { "data": "serviceId", "title": "Service Id" },
                            { "data": "serviceId", "title": "Service Id" },
                            { "data": "experience", "title": "Experience" },
                            { "data": "address", "title": "Address" },
                            { "data": "pincode", "title": "Pincode" },
                            { "data": "active", "title": "Active" },
                        ];
                    }
                }else {
                    console.error("Failed to fetch data : ", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
            

        },
        fetchs(){
            queryy = $("#query").val();
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
                    const index = this.data.findIndex(item => item.id === row.id);
                    if (index !== -1) {
                        this.data.splice(index, 1); // Remove the row from the array
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
                const index = this.data.findIndex(item => item.id === row.id);
                if (index !== -1) {
                    this.data.splice(index, 1); // Remove the row from the array
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
                
                const index = this.data.findIndex(item => item.id === row.id);
                if (index !== -1) {
                     this.data[index].active = "Blocked"; // Remove the row from the array
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
                const index = this.data.findIndex(item => item.id === row.id);
                if (index !== -1) {
                     this.data[index].active = "Not Blocked"; // Remove the row from the array
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });

          
        },
        async blockPro(row) {       
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
                const index = this.data.findIndex(item => item.id === row.id);
                // Find the index of the row in the relevant data array and remove it
                if (index !== -1) {
                     this.data[index].active = "Blocked"; // Remove the row from the array
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });

          
        },
        async unblockPro(row) {
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
                const index = this.data.findIndex(item => item.id === row.id);
                if (index !== -1) {
                     this.data[index].active = "Not Blocked"; // Remove the row from the array
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });

          
        },
},  
components: { commonTable },
}

export default searchA;
