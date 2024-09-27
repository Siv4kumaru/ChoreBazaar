import commonTable from "../../components/commonTable.js";

const adminDashboard ={
    template:`
    <div>
        <commonTable v-if="data1.length && columns.length" :title="title[0]" :data="data1" :selector="selector[0]" :columns="columns"></commonTable>
        <commonTable v-if="data2.length && columns.length" :title="title[1]" :data="data2" :selector="selector[1]" :columns="columns"></commonTable>
     </div>`,
    data() {
        return {
            selector:[],
            title:[],
            data1:[],
            data2:[],
            data3:[],
            data4:[],
            columns:[],
        };
    },
    async mounted() {

        const res=await fetch(window.location.origin+`/api/customer`,{
            method: "GET", 
            headers:{
                "Authentication-token":sessionStorage.getItem("token")
            }, 
        });

        if (res.ok) {
            const data1 = await res.json();
            this.data1=data1;
            this.selector.push("table");
            this.title.push("Customers");
            this.columns = [
                { "data": "name", "title": "Name" },
                { "data": "email", "title": "Email" },
                { "data": "phone", "title": "Phone" },
                { "data": "address", "title": "Address" },
                { "data": "pincode", "title": "Pincode" },
                { 
                    // New column for the button
                    "data": null, // No data needed from the source
                    "title":"Actions",
                    "render": function(data, type, row) {
                        return `<button class="btn btn-success"><i class="fa-regular fa-circle-check"></i> Accept</button>
                        <button class="btn btn-danger "><i class="fa-regular fa-circle-xmark"></i> Reject</button>
                        <button class="btn btn-primary "><i class="fa-regular fa-eye"></i> View</button>`;
                    }}, 
                {"data":"id","title":"Id"},
                ];
            console.log(data1);  
        }
        const res2=await fetch(window.location.origin+`/api/professional`,{
            method: "GET", 
            headers:{
                "Authentication-token":sessionStorage.getItem("token")
            }, 
        });
        
        if (res2.ok) {
            const data2 = await res2.json();
            this.data2=data2;
            this.selector.push("table2");
            this.title.push("Professionals");
            this.columns = [
                { "data": "name", "title": "Name" },
                { "data": "email", "title": "Email" },
                { "data": "phone", "title": "Phone" },
                { "data": "address", "title": "Address" },
                { "data": "pincode", "title": "Pincode" },
                {"data":"serviceName","title":"ServiceName"},
                {"data": "experience", "title": "Experience" },
                {"data":"serviceId","title":"ServiceId"},
                {"data":"id","title":"Id"},
                { 
                    // New column for the button
                    "data": null, // No data needed from the source
                    "title":"Actions",
                    "render": function(data, type, row) {
                        return `<button class="btn btn-success"><i class="fa-regular fa-circle-check"></i> Accept</button>
                        <button class="btn btn-danger "><i class="fa-regular fa-circle-xmark"></i> Reject</button>
                        <button class="btn btn-primary "><i class="fa-regular fa-eye"></i> View</button>`;
                    }} 
            ];

            console.log(data2);  
        }
        // const res3=await fetch(window.location.origin+`/api/services`,{
        //     method: "GET", 
        //     headers:{
        //         "Authentication-token":sessionStorage.getItem("token")
        //     }, 
        // });

        // if (res3.ok) {
        //     const data3 = await res3.json();
        //     this.data3=data3;
        //     this.selector.push("table");
        //     this.title.push("Services");
        //     console.log(data3);  
        // }
        // const res4=await fetch(window.location.origin+`/api/requests`,{
        //     method: "GET", 
        //     headers:{
        //         "Authentication-token":sessionStorage.getItem("token")
        //     }, 
        // });

        // if (res4.ok) {
        //     const data4 = await res4.json();
        //     this.data4=data4;
        //     this.selector.push("table");
        //     this.title.push("Requests");
        //     console.log(data4);  
        // }


    },
    components: { commonTable },
}

export default adminDashboard;