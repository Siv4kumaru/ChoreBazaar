import changedCommonTable  from "../../components/changedCommonTable.js";
const searchC = {
    template:`
    <div>
    <h1>Search</h1>
    <br>  
        <select  disabled>
        <option selected>professional</option>
        </select>
        <input v-model="queryy" type="text" placeholder="Search.." id="query" name="query" @keyup="eachkey()">
        <button><i class="fa-solid fa-magnifying-glass"></i></button>
        <br>
        <br>
            <changedCommonTable :condition="(row)=>true" :title="title" :data="data" :selector="selector" :columns="columns">
            <template v-slot:actions="{ row }">
            <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
            <button class="btn btn-success btn-sm" @click="bookPro(row)">Book</button>
            </template>
        </changedCommonTable>
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
            req:null,
            queryy:'',
            data:null,
            selector:'',
            title:'',
            columns:null,
            viewRow: {}
        }
    },
    methods:{
        async custId(){
            const res = await fetch(window.location.origin +`/api/customer/${sessionStorage.getItem("email")}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-token": sessionStorage.getItem("token"),
                }
            });
            if(res.ok){
                const data = await res.json();
                return data;}
            else{
                console.error("Failed to fetch data: ", res.statusText);
            }
        },
        async eachkey(){
            var query = $("#query").val().toLowerCase();
            $("#table tbody tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(query) > -1)
              });
            console.log(query);

        },
        async req2(){
            const req2 = await fetch(window.location.origin + `/api/requests` , {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-token": sessionStorage.getItem("token"),
                },
                
            });
            if (req2.ok) {
                const data = await req2.json();
                return data;
            } else {
                console.error("Failed to fetch data: ", req2.statusText);
            }
        },
        async cat(){

            $("#query").val("");    
            
            try {
                const res = await fetch(window.location.origin + `/api/professional` , {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-token": sessionStorage.getItem("token"),
                    }
                });
                
                if (res.ok) {
                    const data = await res.json();
                    var req2=await this.req2();
                    if(data != null){
                        for(let i in data){
                            if(data[i].active==false){
                                data.splice(i,1);}
                        }
                    }
                        console.log(data);
                        //remove the alredy booked professionals
                        for(let i in data){
                            for (let j in req2){
                                if(data[i]){
                                if((data[i].email==req2[j].proemail) && (req2[j].custemail==sessionStorage.getItem("email"))){
                                    data.splice(i,1);
                                    console.log("removed");
                                }}
                            }
                  }
                        this.data=data;
                        this.selector="table";
                        this.title="Professionals";     
                        this.columns=[
                            { "data": "name", "title": "Name" },
                            { "data": "email", "title": "Email" },
                            { "data": "phone", "title": "Phone" },
                            { "data": "serviceName", "title": "Service Name" },
                            { "data": "experience", "title": "Experience" },
                            { "data": "address", "title": "Address" },
                            { "data": "pincode", "title": "Pincode" },

                        ];
                    
                }else {
                    console.error("Failed to fetch data: ", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        },
        view(row) {
            this.viewRow = { ...row }; // Copy row data
            // Remove 'id' from viewRow if it exists
            for (let v in this.viewRow) {
                console.log(`${v}: ${this.viewRow[v]}`);
                if ((v.includes('id')) || (v.includes('Id')) || (v.includes('active'))) {
                    delete this.viewRow[v];
                }
            }
            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('viewModal'));
            modal.show();
        },
        async bookPro(row){   
            console.log(row);
            this.req = await fetch(window.location.origin + "/api/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-token": sessionStorage.getItem("token"),
                },
                body: JSON.stringify({
                    "customerEmail": sessionStorage.getItem("email"),
                    "proUserId": row.proid,
                    "dateofrequest": new Date().toISOString(),
                    "dateofcompletion": null,
                    "serviceId": row.serviceId
                })
            });
            if (this.req.ok) {
                console.log("Request added");
                const response = await req.json();
                console.log(response);
                this.$router.push("/Dashboard-Customer");
            } else {
                const errorData = await this.req.json(); // Parse the JSON error response
                console.error("Error:", errorData.message);
            }
        }


    },
     mounted(){
        this.cat()},
    components: {changedCommonTable}
}

export default searchC;
