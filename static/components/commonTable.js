const commonTable={
    template:`<div class="container">
                <h2>{{ title }}</h2>
                <table id="table" class="table display cell-border compact">
                <thead class="table-dark">  
                </thead>
                </table>
                </div>`,
    data() {
        return {

        };
    },
    props: {
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
            new DataTable("#table", {
                "data": data,
                "columns": columns,
                "columnDefs": [
                    {
                        "targets": '_all',
                        className: 'dt-body-left'
                    }
                ],
                "lengthChange": false,
            });
        }   
    }

}

    export default commonTable;