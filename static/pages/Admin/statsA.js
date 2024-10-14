const statsA = {
    template:`<div>
    <div class="container"> 
        <div class="row">
            <div class="col-8"><canvas id="myChart"></canvas></div>
            <div class="col-4"><canvas id="myChart2"></canvas></div>
            </div>
        <br>
        <div class="row">
            <div class="col-8"><canvas id="myChart3"></canvas></div>

        </div>    
    </div>
    serviceName:{{serviceName}}
    proservcount:{{proservcount}}
    procount:{{procount}}
    custcount:{{custcount}}
    servicecount:{{servicecount}}
</div>
    `,
    data(){
        return{
            serviceName:[],
            proservcount:{},
            procount:0,
            custcount:0,
            servicecount:0,
            bubbleData: [],
            proexp:[],
            proincome:[],
            prorequestcount:[],
            reqcount:[]
        };
    },
    async mounted(){

        const req= await fetch(window.location.origin+'/api/requests', {
            headers:{
                "Content-Type": "application/json",
                "Authentication-token":sessionStorage.getItem("token")
            }
        });
        if(req.ok){
            const reqdata=await req.json();
            console.log(reqdata);
            
            var reqServCalled={};
            for (let i in reqdata){

                if(reqServCalled[reqdata[i].serviceName]){
                    reqServCalled[reqdata[i].serviceName]+=1;
                }
                else{
                    reqServCalled[reqdata[i].serviceName]=1;
                }
            } 

        }

        var servicePrice=null;
        const servprice= await fetch(window.location.origin+'/api/earning', {
            headers:{
                "Content-Type": "application/json",
                "Authentication-token":sessionStorage.getItem("token")
            }
        });  
        if(servprice.ok){

            var servicePriceData=[];
            servicePrice=await servprice.json();
            console.log(servicePrice);
            for(let i in servicePrice){
                servicePriceData.push(servicePrice[i]);
            }
        }


        const proserv= await fetch(window.location.origin+'/api/professional',{
            headers:{
                "Content-Type": "application/json",
                "Authentication-token":sessionStorage.getItem("token")
            }
        });
        if(proserv.ok){
            const pros=await proserv.json();
            console.log(pros);
            for (let i in pros){
                this.procount+=1;
                var service=pros[i].serviceName;
                if (this.proservcount[service]){
                    this.proservcount[service]+=1;
                }
                else{
                    this.proservcount[service]=1;
                }

            }
        }
        else{
            console.error("Error fetching professionals");
        }
        const ctx = document.getElementById('myChart');
        console.log(typeof(Chart));
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.serviceName,
            datasets: [{
              label: '# of Professionals',
              data: this.proservcount,
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });

        console.log(reqServCalled);  
        console.log(servicePrice);
        console.log('*********');


        //cust api
        const cust= await fetch(window.location.origin+'/api/customer',{
            headers:{
                "Content-Type": "application/json",
                "Authentication-token":sessionStorage.getItem("token")
            }
        });
        if(cust.ok){
            const custs=await cust.json();
            console.log(custs);
            var custcount=0;
            for (let i in custs){
                this.custcount+=1;
            }

        }
        else{
            console.error("Error fetching customers");}
        //cust api

        //Donut
        for (let i in this.proservcount){
            this.proservcount[i]=this.proservcount[i]
        }
        console.log(this.proservcount);
        const data = {
            labels: [
              'Professional',
            'Customer',
            ],
            datasets: [{
              label: 'My First ',
              data: [this.procount, this.custcount],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
              hoverOffset: 4
            }]
          };


        const config = {
            type: 'pie',
            data: data,
            };
            new Chart($('#myChart2'), config);

        //Donut

        //Polar area

          const data2 = {
            labels:this.serviceName,
            datasets: [{
              label: 'Earnings',
              data:  servicePriceData,

            }]
          };
          const config2 = {
            type: 'polarArea',
            data: data2,
            options: {}
          };
        new Chart($('#myChart3'), config2);
        //Polar area

        //service price vs cust

        

        //service price vs cust

 
    }
};

export default statsA;
