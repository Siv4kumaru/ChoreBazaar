import changedCommonTable from '../../components/changedCommonTable.js'

const historyP = {
    template: `<div>
        <input v-model="query" type="text" placeholder="Search.." id="query" name="query" @keyup="eachkey()">
        <button><i class="fa-solid fa-magnifying-glass" @click="eachhkey()"></i></button>
        <changedCommonTable title="History" :data="data" :columns="columns" selector="history" :condition="(row) => true"></changedCommonTable>
        <button class="btn btn-primary" @click="back">Back</button>
    </div>`,
    
    data() {
        return {
            columns: [],
            data: [],
            query: ""
        };
    },

    created() {
        // Check local storage for existing values
        const savedColumns = localStorage.getItem('historyColumns');
        const savedData = localStorage.getItem('historyData');
        
        
        if (savedColumns) {
            this.columns = JSON.parse(savedColumns);
        } else {
            this.columns = JSON.parse(this.$route.params.columns)[0];
            this.columns.push({data:"dateofcompletion",title:"Date of Completion"});
        }
        
        if (savedData) {
            this.data = JSON.parse(savedData);
        } else {
            this.data = JSON.parse(this.$route.params.data);

        }
    },

    mounted() {
        // Save columns and data to local storage
        
        localStorage.setItem('historyColumns', JSON.stringify(this.columns));
        localStorage.setItem('historyData', JSON.stringify(this.data));
        console.log(this.data);

    },

    beforeRouteLeave(to, from, next) {
        // Clear specific local storage items when navigating away
        localStorage.removeItem('historyColumns');
        localStorage.removeItem('historyData');
        
        next(); // Proceed to the next route
    },

    methods: {
        async eachkey(){
            var query = $("#query").val().toLowerCase();
            $("#history tbody tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(query) > -1)
              });
            console.log(query);
        },
        back() {
            this.$router.push("/Dashboard-Professional");
        }
    },

    components: { changedCommonTable }
}

export default historyP;
