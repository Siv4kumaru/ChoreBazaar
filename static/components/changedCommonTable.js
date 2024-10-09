const changedCommonTable={
    template:`<div class="container">
                <h2>{{ title }}
                </h2>
                <table class="table display cell-border compact" :id="selector">
                <thead class="table-dark">  
                    <tr>
                        <th v-for="col in columns">{{ col.title }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="evaluateCondition(row)" v-for="row in data">
                        <td v-for="col in columns">{{ row[col.data] }}</td>

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
        },
        condition:{
            type: Function
        }
    },
    async mounted(){
        
    },
    methods: {
        
        evaluateCondition(row) {
            return this.condition(row); 
          }
        
        
        
    }

}

export default changedCommonTable;