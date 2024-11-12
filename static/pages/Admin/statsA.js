const statsA = {
  template: `
    <div class="stats-container">
      <ul class="nav nav-tabs" id="myTabs">
        <li class="nav-item" v-for="n in 4" :key="n">
          <a 
            class="nav-link" 
            :class="{ active: currentTab === 'tab' + n }"
            :id="'tab' + n"
            href="#"
            @click.prevent="switchTab(n)"
          >
            Chart {{n}}
          </a>
        </li>
      </ul>

      <div class="chart-container" style="position: relative; height: 400px; width: 100%;">
        <canvas 
          v-for="n in 4" 
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
        2: null,
        3: null,
        4: null
      },
      chartData: {
        professionals: null,
        customers: null,
        earnings: null,
        proEarnings: null
      }
    };
  },

  methods: {
    async fetchData(url) {
      try {
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            "Authentication-token": sessionStorage.getItem("token")
          }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
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

    getChartColors(count) {
      const baseColors = [
        { bg: 'rgba(255, 99, 132, 0.5)', border: 'rgb(255, 99, 132)' },
        { bg: 'rgba(54, 162, 235, 0.5)', border: 'rgb(54, 162, 235)' },
        { bg: 'rgba(255, 206, 86, 0.5)', border: 'rgb(255, 206, 86)' },
        { bg: 'rgba(75, 192, 192, 0.5)', border: 'rgb(75, 192, 192)' },
        { bg: 'rgba(153, 102, 255, 0.5)', border: 'rgb(153, 102, 255)' }
      ];

      // If we need more colors than our base set, generate them
      while (baseColors.length < count) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        baseColors.push({
          bg: `rgba(${r}, ${g}, ${b}, 0.5)`,
          border: `rgb(${r}, ${g}, ${b})`
        });
      }

      return baseColors;
    },

    async renderProfessionalsChart() {
      if (!this.chartData.professionals) {
        this.chartData.professionals = await this.fetchData(`${window.location.origin}/api/professional`);
      }

      const data = this.chartData.professionals;
      if (!data) return;

      const proServiceCount = {};
      data.forEach(pro => {
        const service = pro.serviceName;
        proServiceCount[service] = (proServiceCount[service] || 0) + 1;
      });

      this.destroyChart(1);
      const ctx = document.getElementById('myChart1');
      if (!ctx) return;

      this.charts[1] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(proServiceCount),
          datasets: [{
            label: '# of Professionals',
            data: Object.values(proServiceCount),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },

    async renderDonutChart() {
      if (!this.chartData.professionals || !this.chartData.customers) {
        this.chartData.professionals = await this.fetchData(`${window.location.origin}/api/professional`);
        this.chartData.customers = await this.fetchData(`${window.location.origin}/api/customer`);
      }

      if (!this.chartData.professionals || !this.chartData.customers) return;

      this.destroyChart(2);
      const ctx = document.getElementById('myChart2');
      if (!ctx) return;

      this.charts[2] = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Professional', 'Customer'],
          datasets: [{
            data: [
              this.chartData.professionals.length,
              this.chartData.customers.length
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    },

    async renderEarningsChart() {
      if (!this.chartData.earnings) {
        this.chartData.earnings = await this.fetchData(`${window.location.origin}/api/earning`);
      }

      const data = this.chartData.earnings;
      if (!data) return;

      this.destroyChart(3);
      const ctx = document.getElementById('myChart3');
      if (!ctx) return;

      const colors = this.getChartColors(Object.keys(data).length);

      this.charts[3] = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: Object.keys(data),
          datasets: [{
            label: 'Service Earnings',
            data: Object.values(data),
            backgroundColor: colors.map(c => c.bg),
            borderColor: colors.map(c => c.border),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              position: 'right'
            },
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

    async renderProEarningsChart() {
      if (!this.chartData.proEarnings) {
        this.chartData.proEarnings = await this.fetchData(`${window.location.origin}/api/proEarning`);
      }

      const data = this.chartData.proEarnings;
      if (!data) return;

      this.destroyChart(4);
      const ctx = document.getElementById('myChart4');
      if (!ctx) return;

      const colors = this.getChartColors(Object.keys(data).length);

      this.charts[4] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(data),
          datasets: [{
            label: 'Professional Earnings',
            data: Object.values(data),
            backgroundColor: colors.map(c => c.bg),
            borderColor: colors.map(c => c.border),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Earnings: $${context.raw.toLocaleString()}`;
                }
              }
            }
          }
        }
      });
    },

    async renderChart(chartType) {
      try {
        switch (chartType) {
          case 1:
            await this.renderProfessionalsChart();
            break;
          case 2:
            await this.renderDonutChart();
            break;
          case 3:
            await this.renderEarningsChart();
            break;
          case 4:
            await this.renderProEarningsChart();
            break;
        }
      } catch (error) {
        console.error(`Error rendering chart ${chartType}:`, error);
      }
    }
  },

  async mounted() {
    // Initialize first chart after component is mounted
    await this.$nextTick();
    await this.renderChart(1);
  },

  // Clean up charts when component is destroyed
  beforeDestroy() {
    Object.keys(this.charts).forEach(chartType => {
      this.destroyChart(Number(chartType));
    });
  }
};

export default statsA;