const statsC = {
    template: `
      <div class="stats-container">
        <h1>Customer Stats</h1>
        <ul class="nav nav-tabs" id="myTabs">
<li class="nav-item" v-for="(name, n) in ['Spending Distribution', 'Service Status']" :key="n+1">
  <a 
    class="nav-link" 
    :class="{ active: currentTab === 'tab' + (n+1) }"
    :id="'tab' + (n+1)"
    href="#"
    @click.prevent="switchTab(n+1)"
    >
    {{ name }}
    </a>
    </li>
    </ul>
    
    <div class="chart-container" style="position: relative; height: 400px; width: 100%;">
    <div class="alert alert-success d-flex align-items-center p-3" style="border-radius: 10px; background: linear-gradient(135deg, #d4edda, #c3e6cb); box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
        <i class="bi bi-currency-dollar" style="font-size: 1.5rem; margin-right: 10px; color: #28a745;"></i>
        <span style="font-size: 1.2rem; font-weight: 600;">Total Spending: {{ totalSpending }}</span>
    </div>
    <canvas 
    v-for="n in 2" 
            :key="n"
            :id="'myChart' + n"
            v-show="currentTab === 'tab' + n"
            style="width: 100%; height: 100%;"
          ></canvas>

          
        </div>
      </div>
    `,
  
    data() {
      return {
        currentTab: 'tab1',
        charts: {
          1: null,
          2: null
        },
        chartData: {
          spending: null,
          status: null
        },
        totalSpending:0
      };
    },
  
    methods: {
      async fetchData() {
        try {
          const response = await fetch(`${window.location.origin}/api/customer/${sessionStorage.getItem("email")}/spending`, {
            headers: {
              "Authentication-token": sessionStorage.getItem("token")
            }
          });
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          this.chartData.spending = data.spend;
          this.chartData.status = data.status;
          return data;
        } catch (error) {
          console.error('Error fetching data:', error);
          return null;
        }
      },
  
      destroyChart(chartType) {
        if (this.charts[chartType]) {
          this.charts[chartType].destroy();
          this.charts[chartType] = null;
        }
      },
  
      async switchTab(tabNumber) {
        this.currentTab = 'tab' + tabNumber;
        await this.$nextTick();
        await this.renderChart(tabNumber);
      },
  
      getRandomColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
          const r = Math.floor(Math.random() * 255);
          const g = Math.floor(Math.random() * 255);
          const b = Math.floor(Math.random() * 255);
          colors.push(`rgb(${r}, ${g}, ${b})`);
        }
        return colors;
      },
  
      async renderSpendingChart() {
        if (!this.chartData.spending) {
          await this.fetchData();
        }
  
        const data = this.chartData.spending;
        if (!data) return;
  
        this.destroyChart(1);
        const ctx = document.getElementById('myChart1');
        if (!ctx) return;
  
        const labels = Object.keys(data);
        const dataValues = Object.values(data);
        const backgroundColors = this.getRandomColors(labels.length);
  
        this.charts[1] = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              label: 'Expenses',
              data: dataValues,
              backgroundColor: backgroundColors,
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.label}: $${context.raw.toLocaleString()}`;
                  }
                }
              }
            }
          }
        });
      },
  
      async renderStatusChart() {
        if (!this.chartData.status) {
          await this.fetchData();
        }
  
        const data = this.chartData.status;
        if (!data) return;
  
        this.destroyChart(2);
        const ctx = document.getElementById('myChart2');
        if (!ctx) return;
  
        const labels = Object.keys(data);
        const dataValues = Object.values(data);
        const backgroundColor = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`;
        const borderColor = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;
  
        this.charts[2] = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: labels,
            datasets: [{
              label: sessionStorage.getItem("email"),
              data: dataValues,
              fill: true,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              pointBackgroundColor: borderColor,
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: borderColor
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
              line: {
                borderWidth: 3
              }
            },
            scales: {
              r: {
                beginAtZero: true
              }
            }
          }
        });
      },
  
      async renderChart(chartType) {
        try {
          switch (chartType) {
            case 1:
              await this.renderSpendingChart();
              break;
            case 2:
              await this.renderStatusChart();
              break;
          }
        } catch (error) {
          console.error(`Error rendering chart ${chartType}:`, error);
        }
      }
    },
  
    async mounted() {
      await this.$nextTick();
      await this.renderChart(1);
      for (let i in this.chartData.spending)
      {
        this.totalSpending += this.chartData.spending[i];
      }
    },
  
    beforeDestroy() {
      Object.keys(this.charts).forEach(chartType => {
        this.destroyChart(Number(chartType));
      });
    }
  };
  
  export default statsC;