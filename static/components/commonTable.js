const commonTable={
    template:`<div class="container">
                <h2>{{ title }}</h2>
                <table class="table display cell-border compact" :id="selector">
                <thead class="table-dark">  
                </thead>
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
        this.commonTable(this.data,this.columns);
    },
    methods: {
        commonTable(data,columns) {
            var sel='#'+this.selector;//thos tookk me 2 days to figure out
            new DataTable(sel, {
                "data": data,
                "columns": columns,
                "lengthChange": false,
                "columnDefs": [
                    {
                        "targets": '_all',
                        className: 'dt-body-left'
                    },
                    {
                        "targets": columns.reduce((acc, col, index) => {
                            if (col.title.toLowerCase().includes('id')) {
                                acc.push(index);
                            }
                            return acc;
                        }, []),
                        "visible": false
                    }
                ],
                
            });
        },
         

    }

}

    export default commonTable;