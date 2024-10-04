const commonTable={
    template:`<div class="container">
                <h2>{{ title }}
                <button v-if="title=='Services'" class="btn btn-primary" @click="add">Add</button>
                </h2>
                <table class="table display cell-border compact" :id="selector">
                <thead class="table-dark">  
                    <tr>
                        <th v-for="col in columns">{{ col.title }}</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in data">
                        <td v-for="col in columns">{{ row[col.data] }}</td>
                        <td>
                        <slot name="actions" :row="row"></slot>
                        </td>
                    </tr>
                </tbody>
                </table>
                </div>`,
    data() {
        return {

        };
    },
    props: {
        selector: {
            type: String
        },
        title: {
        type: String
        },
        data: {
            type: Array
        },
        columns: {
            type: Array
        }

    },
    async mounted(){
        
    },
    methods: {
        
         add(){
            console.log("add");
            this.$router.push("/addService");
        },
        
        
        
    }

}

    export default commonTable;