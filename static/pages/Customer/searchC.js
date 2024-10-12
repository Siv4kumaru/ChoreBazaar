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
                viewRow: {},
                noProId:[],
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
            async cat(){
                $("#query").val("");    
                
                try {
                    const res = await fetch(window.location.origin + `/api/professional`, {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            "Authentication-token": sessionStorage.getItem("token"),
                        }
                    });

                    
                    if (res.ok) {
                        const DATA=[];
                        const data = await res.json();
                        await this.prodisplay();
                        for(var i in data){

                            if(!(this.noProId.includes(data[i].proid)) && data[i].active==1){
                                DATA.push(data[i]);
                            }
                        }   
                            var cust= await this.custId();
                            this.data=DATA;
                            for(var i in this.data){
                                this.data[i] = {...this.data[i], ...cust};      
                        }

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
                    try {
                        var currentdate = new Date(); 
                        var datetime = currentdate.getDate() + "/"
                            + (currentdate.getMonth()+1)  + "/" 
                            + currentdate.getFullYear() + " @ "  
                            + currentdate.getHours() + ":"  
                            + currentdate.getMinutes() + ":" 
                            + currentdate.getSeconds(); 
                
                        const req = await fetch(window.location.origin + "/api/requests", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authentication-token": sessionStorage.getItem("token"),
                            },
                            body: JSON.stringify({
                                "customerId": row.custId,
                                "proUserId": row.proUserId,
                                "serviceId": row.serviceId,
                                "dateofrequest": datetime,
                                "dateofcompletion": "35682",
                            })
                        });
                
                        if (req.ok) {
                            const response = await req.json();
                            console.log("Request added:", response);
                            this.$router.push("/Dashboard-Customer");
                        } else {
                            const errorData = await req.json(); 
                            console.error("Error:", errorData.message);
                        }
                    } catch (error) {
                        console.error("Unexpected error during request:", error);
                    }
                  
            },
            async prodisplay(){

                const res1 = await fetch(window.location.origin + `/api/professional`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-token": sessionStorage.getItem("token"),
                    }
                });
                const res2 = await fetch(window.location.origin + `/api/requests_proper`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-token": sessionStorage.getItem("token"),
                    }
                });
                var email=sessionStorage.getItem("email");
                const res3 = await fetch(window.location.origin + `/api/customer/${email}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-token": sessionStorage.getItem("token"),
                    }
                });

                
                if(res1.ok && res2.ok && res3.ok){
                    const pro = await res1.json();
                    const req = await res2.json();
                    const cust = await res3.json();
                    var custId=await this.custId();
                    for(let i in req){
                        if((req[i].customerId==custId.custId)){
                            //owner specific 
                            for(let j in pro){
                                if(pro[j].proid==req[i].professionalId){
                                this.noProId.push(pro[j].proid);
                                }
                            }
                            
                        }
                    }

                    //dsa time, if pro and cust and service
                    //time next
                }
                else{
                    console.error("Failed to fetch data");
                }
            },


        },
        mounted(){

            this.cat()
            },
 
        components: {changedCommonTable}
    }

    export default searchC;
