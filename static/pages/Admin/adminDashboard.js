import commonTable from "../../components/commonTable.js";

const adminDashboard ={
    template:`
    <div>
        <commonTable v-if="data1.length && columns.length" :title="title" :data="data1" :columns="columns"></commonTable>
    </div>`,
    data() {
        return {
            title:"Customers",
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
            console.log(data2);  
        }
        const res3=await fetch(window.location.origin+`/api/services`,{
            method: "GET", 
            headers:{
                "Authentication-token":sessionStorage.getItem("token")
            }, 
        });

        if (res3.ok) {
            const data3 = await res3.json();
            this.data3=data3;
            console.log(data3);  
        }
        const res4=await fetch(window.location.origin+`/api/requests`,{
            method: "GET", 
            headers:{
                "Authentication-token":sessionStorage.getItem("token")
            }, 
        });

        if (res4.ok) {
            const data4 = await res4.json();
            this.data4=data4;
            console.log(data4);  
        }
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
                    }} 
            ]

        // new DataTable('#customer',{
        //     "data": this.data1,
        //     "columns": [
        //         { "data": "name", "title": "Name" },
        //         { "data": "email", "title": "Email" },
        //         { "data": "phone", "title": "Phone" },
        //         { "data": "address", "title": "Address" },
        //         { "data": "pincode", "title": "Pincode" },
        //         { 
        //             // New column for the button
        //             "data": null, // No data needed from the source
        //             "title":"Actions",
        //             "render": function(data, type, row) {
        //                 return `<button class="btn btn-success"><i class="fa-regular fa-circle-check"></i> Accept</button>
        //                 <button class="btn btn-danger "><i class="fa-regular fa-circle-xmark"></i> Reject</button>
        //                 <button class="btn btn-primary "><i class="fa-regular fa-eye"></i> View</button>`;
        //             }} 
        //     ],
        //     columnDefs: [
        //         {
        //             "targets": '_all',
        //             className: 'dt-body-left'
        //         }
        //     ],
        //     "lengthChange": false,

        // });
    },
    components: { commonTable },
}

export default adminDashboard;