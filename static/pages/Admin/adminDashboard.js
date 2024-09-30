    import commonTable from "../../components/commonTable.js";

    const adminDashboard ={
        template:`
        <div>
            <commonTable v-if="this.columns[0]" :title="title[0]" :data="data[0]" :selector="selector[0]" :columns="columns[0]" >
                <template v-slot:actions="{ row }">
                <button class="btn btn-primary btn-sm" @click="viewCustomer(row)">View</button>
                <button class="btn btn-danger btn-sm" @click="deleteCustomer(row.id)">Delete</button>
                </template>
            </commonTable>

            <commonTable v-if="this.columns[1]" :title="title[1]" :data="data[1]" :selector="selector[1]" :columns="columns[1]">
                <template v-slot:actions="{ row }">
                <button class="btn btn-primary btn-sm" @click="viewCustomer(row)">View</button>
                <button class="btn btn-danger btn-sm" @click="deleteCustomer(row.id)">Delete</button>
                </template>
            </commonTable>

            <commonTable v-if="this.columns[2]" :title="title[2]" :data="data[2]" :selector="selector[2]" :columns="columns[2]">
                <template v-slot:actions="{ row }">
                <button class="btn btn-primary btn-sm" @click="viewCustomer(row)">View</button>
                <button class="btn btn-danger btn-sm" @click="deleteCustomer(row.id)">Delete</button>
                </template>
            </commonTable>

            <commonTable v-if="this.columns[3]" :title="title[3]" :data="data[3]" :selector="selector[3]" :columns="columns[3]">
                <template v-slot:actions="{ row }">
                <button class="btn btn-primary btn-sm" @click="viewCustomer(row)">View</button>
                <button class="btn btn-danger btn-sm" @click="deleteCustomer(row.id)">Delete</button>
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
            hi(){   
                console.log("hi");
            }
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
                    { "data":"id","title":"Id" },
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
                    { "data":"id","title":"Id"},
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
                    { "data":"id","title":"Id"},
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