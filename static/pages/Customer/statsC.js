const statsC = {
    template:`<div><h1>Customer Stats</h1>
                    <div class="col-4"><canvas id="myChart"></canvas></div>
                    <div class="col-4"><canvas id="myChart2"></canvas></div>
    </div>`,
   async mounted(){
    const res = await fetch(window.location.origin + `/api/customer/${sessionStorage.getItem("email")}/spending`, {
        headers: {
            "Authentication-token": sessionStorage.getItem("token"),
        },
    });
    if (res.ok) {
        var inputDat = await res.json();
        var inputData = inputDat['spend'];
        var jsonData = inputDat['status'];
        console.log(inputData);} 
            // Dynamically extract labels and data
    const labels = Object.keys(inputData);  // Extract labels dynamically from keys
    const dataValues = Object.values(inputData);  // Extract data dynamically from values

    // Dynamically generate random colors for each segment
    const backgroundColors = labels.map(() => {
        // Generate random RGB colors
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgb(${r}, ${g}, ${b})`;
    });

    // Data for the chart
    const data = {
        labels: labels,
        datasets: [{
            label: 'Expenses',
            data: dataValues,  // Use the dynamic data
            backgroundColor: backgroundColors,  // Use dynamic colors
            hoverOffset: 4
        }]
    };

    // Configuration for the doughnut chart
    const config = {
        type: 'doughnut',
        data: data,
    };

    const myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
    
    // Render the chart
    
    
    // Extracting labels and data from JSON dynamically
    const labels2 = Object.keys(jsonData);
    const dataPoints2 = Object.values(jsonData);

    console.log(labels2);
    console.log(dataPoints2);
    
    // Function to generate random RGB color
    function getRandomColor() {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    // Radar chart configuration with dynamic data, colors, and labels
    const config2 = {
        type: 'radar',
        data: {
            labels: labels2,  // Dynamic labels
            datasets: [{
                label: sessionStorage.getItem("email"),  // Dynamic label
                data: dataPoints2,  // Dynamic data
                fill: true,
                backgroundColor: getRandomColor(),  // Dynamic background color
                borderColor: getRandomColor(),  // Dynamic border color
                pointBackgroundColor: getRandomColor(),
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: getRandomColor()
            }]
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    };
    
    // Initialize chart
    const ctx = document.getElementById('myChart2').getContext('2d');
    new Chart(ctx, config2);
    
    }
}

export default statsC;
