const statsA = {
    template:`<div>
    <div class="container"> 
        <div class="row">
            <div class="col-8"><canvas id="myChart"></canvas></div>
            <div class="col-4"><canvas id="myChart2"></canvas></div>
            </div>
        <div class="row">
            <div class="col-7"><canvas id="myChart3"></canvas></div>
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


        const servu= await fetch(window.location.origin+'/api/services',{
            headers:{
                "Content-Type": "application/json",
                "Authentication-token":sessionStorage.getItem("token")
            }
        });
        if(servu.ok){
            const services=await servu.json();
            console.log(services);
            var servicePrice={};
            for (let i in services){
                this.serviceName.push(services[i].name);
                this.servicecount+=1;
                if(servicePrice[services[i].name]){
                    servicePrice[services[i].name]+=services[i].price;
                }
                else{
                    servicePrice[services[i].name]=services[i].price;
                }

            }
            console.log(`servicePrice:${JSON.stringify(servicePrice)}`);
    }
        else{
            console.error("Error fetching services");
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
        for (let i in servicePrice){
            console.log(i);
            if(i in reqServCalled){
                console.log(reqServCalled[i]);
                servicePrice[i]=servicePrice[i]*reqServCalled[i];
            }
            else{
                console.log(0);
                servicePrice[i]=0;
            }
        }
        console.log(servicePrice);

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
              data:  this.serviceName.map(I => servicePrice[I]),
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
                'rgb(54, 162, 235)'
              ]
            }]
          };
          const config2 = {
            type: 'polarArea',
            data: data2,
            options: {}
          };
        new Chart($('#myChart3'), config2);
        //Polar area
    }
};

export default statsA;
