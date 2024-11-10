const statsA = {
    template:`<div>
    {{currentTab}}
    <ul class="nav nav-tabs" id="myTabs">
        <li class="nav-item">
            <a class="nav-link active" id="tab1" data-bs-toggle="tab" href="#" @click="currentTab='tab1'" >Chart 1</a>
        </li>
        <li class="nav-item" >
            <a class="nav-link" id="tab2" data-bs-toggle="tab" href="#" @click="currentTab='tab2'">chart 2</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="tab3" data-bs-toggle="tab" href="#" @click="currentTab='tab3'">Chart 3</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="tab4" data-bs-toggle="tab" href="#" @click="currentTab='tab4'">chart 4</a>
        </li>
    </ul>

    <div class="tab-pane fade show active" id="content1" >
        <canvas id="myChart" style="width:0.8rem;height:0.3rem"></canvas>
    </div>
    <div class="tab-pane fade" id="content2" style="margein:0 0;" >
        <canvas id="myChart2" style="width:0.8rem;height:0.3rem"></canvas>
    </div>
    <span  class="tab-pane fade" id="content3">
        <canvas id="myChart3" style="width:0.8rem;height:0.3rem"></canvas>
    </span>
    <div class="tab-pane fade" id="content4">
        <canvas id="myChart4" style="width:0.8rem;height:0.3rem"></canvas>
    </div>
</div>

    `,
    data(){
        return{
          currentTab: 'tab1',
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

        //pro vs pro

        

// Function to generate random RGBA colors
function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.2)`; // Adjust alpha (0.2) for background
  }
  
  // Function to generate random RGB colors for border
  function getRandomBorderColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  // Fetch dynamic data from API
  const proEarningall = await fetch(window.location.origin + '/api/proEarning', {
    headers: {
      "Content-Type": "application/json",
      "Authentication-token": sessionStorage.getItem("token")
    }
  });
  
  let proEarningData = [];
  let proLabels = [];
  
  if (proEarningall.ok) {
    const proEarning = await proEarningall.json();
    console.log(proEarning);
    
    // Extract labels (pro names) and data (income)
    proLabels = Object.keys(proEarning); // ['pro', 'new pro']
    proEarningData = Object.values(proEarning); // [20000.0, 20000.0]
  }
  
  // Dynamically generate random colors based on the length of the data array
  const backgroundColors = proEarningData.map(() => getRandomColor());
  const borderColors = proEarningData.map(() => getRandomBorderColor());
  
  const data4 = {
    labels: proLabels, // Use pro names as labels
    datasets: [{
      label: 'Pro Earnings',
      data: proEarningData, // Use dynamic data array from API
      backgroundColor: backgroundColors, // Use dynamically generated background colors
      borderColor: borderColors, // Use dynamically generated border colors
      borderWidth: 1
    }]
  };
  
  const config4 = {
    type: 'bar',
    data: data4,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };
  
  // Create and render the chart
  const myChart = new Chart(
    document.getElementById('myChart4'),
    config4
  );
  
  const tabs = new bootstrap.Tab(document.querySelector('#tab1'));
  tabs.show(); // Show the first tab on page load

  // This part ensures that when a tab is clicked, it switches its content accordingly
  document.querySelectorAll('.nav-link').forEach(tab => {
    tab.addEventListener('click', function (event) {
      const targetContent = document.querySelector('#content' + tab.id.slice(-1));
      document.querySelectorAll('.tab-pane').forEach(content => {
        content.classList.remove('show', 'active');
      });
      targetContent.classList.add('show', 'active');
    });
  });

        

 
    },

};

export default statsA;
