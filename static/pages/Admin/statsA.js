const statsA = {
    template:`<div>
    
  <canvas id="myChart"></canvas>

</div>
    `,
    data(){
        return{
            serviceName:[],
            proservcount:{},
        };
    },
    async mounted(){
        const serv= await fetch(window.location.origin+'/api/services',{
            headers:{
                "Content-Type": "application/json",
                "Authentication-token":sessionStorage.getItem("token")
            }
        });
        if(serv.ok){
            const services=await serv.json();
            console.log(services);
            for (let i in services){
                this.serviceName.push(services[i].name);}
            console.log(this.serviceName);
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
                var service=pros[i].serviceName;
                if (this.proservcount[service]){
                    this.proservcount[service]+=1;
                }
                else{
                    this.proservcount[service]=1;
                }
            }
            console.log(this.proservcount);
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
    },
}

export default statsA;
