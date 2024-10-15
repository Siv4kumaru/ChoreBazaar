const statsP = {
    template:`<div><h1>Professional Stats</h1>
                    <div class="col-4"><canvas id="myChart"></canvas></div>
                    <div class="col-4"><canvas id="myChart2"></canvas></div>
                    <h1>Total Earnings:{{total}}</h1>
    </div>`,
    data(){
        return{
            total:0
        }
        },
   async mounted(){
    const res = await fetch(window.location.origin + `/api/professional/${sessionStorage.getItem("email")}/earning`, {
        headers: {
            "Authentication-token": sessionStorage.getItem("token"),
        },
    });
    if (res.ok) {
        var inputDat = await res.json();
        var inputData = inputDat['status'];
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
            label: sessionStorage.getItem("email"),
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
    const earning= await fetch(window.location.origin + `/api/professional/${sessionStorage.getItem('email')}/earning`, {
        headers: {
            "Content-Type": "application/json",
            "Authentication-token": sessionStorage.getItem("token")
        }
    });

    if (earning.ok) {
        const Earningperdat = await earning.json();
        var Earningperdate = Earningperdat['Earningperdate'];
        console.log(Earningperdate);
        this.total=Earningperdat['total'];
    }

    const datePricePairs = Object.entries(Earningperdate)
    .map(([date, price]) => [new Date(date), price]); // Convert dates to Date objects

// Group earnings by week
const weeklyEarnings = {};

datePricePairs.forEach(([date, price]) => {
    // Get the start of the week (Sunday)
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Set to Sunday

    // Convert the week start date to a string for use as a key
    const weekKey = weekStart.toISOString().substring(0, 10); // Format YYYY-MM-DD

    // Sum the earnings for the week
    if (!weeklyEarnings[weekKey]) {
        weeklyEarnings[weekKey] = 0;
    }
    weeklyEarnings[weekKey] += price;
});

// Create labels (weeks) and data (total earnings per week)
const labels2 = Object.keys(weeklyEarnings);
const data2 = Object.values(weeklyEarnings);
console.log(labels2);
console.log(data2);
// Chart.js configuration
const ctx = document.getElementById('myChart2').getContext('2d');
const myChart2 = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels2,
        datasets: [{
            label: 'Earnings per Date',
            data: data2,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    },
    options: {
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Earnings'
                }
            }
        }
    }
    
    
});
}
}

export default statsP;
