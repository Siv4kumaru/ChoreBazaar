import changedCommonTable from '../../components/changedCommonTable.js'

const history = {
    template: `<div>
        <changedCommonTable title="History" :data="data" :columns="columns" selector="history" :condition="(row) => true"></changedCommonTable>
        <button class="btn btn-primary" @click="back">Back</button>
    </div>`,
    
    data() {
        return {
            columns: [],
            data: []
        };
    },

    created() {
        // Check local storage for existing values
        const savedColumns = localStorage.getItem('historyColumns');
        const savedData = localStorage.getItem('historyData');
        if(savedColumns==[]){
        if (savedColumns.some(col => col.data === "dateofcompletion" && col.title === "Date of Completion")) {
            // Add the column if it does not exist
            savedColumns.splice(4, 0, { data: "dateofcompletion", title: "Date of Completion" });
        }}  

        if (savedColumns) {
            this.columns = JSON.parse(savedColumns);
        } else {
            this.columns = JSON.parse(this.$route.params.columns)[0];
        }

        if (savedData) {
            this.data = JSON.parse(savedData);
        } else {
            this.data = JSON.parse(this.$route.params.data)[0];
        }

        this.columns.push({ data: "dateofcompletion", title: "Date of Completion" });
        this.columns.push({ data: "serviceStatus", title: "Service Status" });
    },

    mounted() {
        // Save columns and data to local storage
        localStorage.setItem('historyColumns', JSON.stringify(this.columns));
        localStorage.setItem('historyData', JSON.stringify(this.data));

    },

    beforeRouteLeave(to, from, next) {
        // Clear specific local storage items when navigating away
        localStorage.removeItem('historyColumns');
        localStorage.removeItem('historyData');
        
        next(); // Proceed to the next route
    },

    methods: {
        back() {
            this.$router.push("/Dashboard-Customer");
        }
    },

    components: { changedCommonTable }
}

export default history;
