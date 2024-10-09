import changedCommonTable from '../../components/changedCommonTable.js'
const history= {
    template: `<div>


    <changedCommonTable title="History" :data="data" :columns="columns" selector="history" :condition="(row)=>true">
    </changedCommonTable>

    <button class="btn btn-primary" @click="back">Back</button>
    </div>
    `,
    data() {
        return {
            
            columns:JSON.parse(this.$route.query.columns)[0],

            data:JSON.parse(this.$route.query.data)[0],


        };
    },

    mounted(){
        console.log(this.columns);
        this.columns.splice(4, 0, {data: "dateofcompletion", title: "Date of Completion"});

    },
    methods:{
        back(){
            this.$router.push("/Dashboard-Customer")}},
    
    components: { changedCommonTable }
}
export default history;