import changedCommonTable  from "../../components/changedCommonTable.js";
const searchC = {
    template:`
    <div>
    <h1>Search</h1>
    <br>    
        <select v-model="selectedType"  id="searchType" @change="cat()" >
            <option :value="s" v-for="s in searchType">{{s}}</option>
        </select>
        <input v-model="queryy" type="text" placeholder="Search.." id="query" name="query" @keyup="eachkey()">
        <button><i class="fa-solid fa-magnifying-glass"></i></button>
        <br>
        <br>
        
            <changedCommonTable :condition="(row)=>false" :title="title" :data="data" :selector="selector" :columns="columns">
            <template v-slot:actions="{ row }">
            <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
            <button class="btn btn-success btn-sm" @click="bookPro(row)">Book</button>
            </template>
        </changedCommonTable>
    </div>`,
    data() {
        return {
            searchType: ['professional'],
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
                const res = await fetch(window.location.origin + `/api/professional`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-token": sessionStorage.getItem("token"),
                    }
                });
                
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
                    if(this.selectedType === "professional"){
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
                    }
                }else {
                    console.error("Failed to fetch data: ", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        },

    },
    components: {changedCommonTable}
}

export default searchC;
