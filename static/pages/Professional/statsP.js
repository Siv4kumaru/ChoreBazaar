const statsP = {
    template: `
        <div class="stats-container">
            <h1>Professional Stats</h1>
            <ul class="nav nav-tabs" id="myTabs">
                <li class="nav-item" v-for="(name, n) in ['Earnings Distribution', 'Weekly Earnings']" :key="n+1">
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
                    <span style="font-size: 1.2rem; font-weight: 600;">Total Earnings: {{ total }}</span>
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
                distribution: null,
                weekly: null
            },
            total: 0
        };
    },

    methods: {
        async fetchData() {
            try {
                const res = await fetch(`${window.location.origin}/api/professional/${sessionStorage.getItem("email")}/earning`, {
                    headers: {
                        "Authentication-token": sessionStorage.getItem("token"),
                    },
                });
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                this.chartData.distribution = data.status;
                this.chartData.weekly = data.Earningperdate;
                this.total = data.total;
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

        async renderDistributionChart() {
            if (!this.chartData.distribution) {
                await this.fetchData();
            }

            const data = this.chartData.distribution;
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
                        label: sessionStorage.getItem("email"),
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

        async renderWeeklyChart() {
            if (!this.chartData.weekly) {
                await this.fetchData();
            }

            const data = this.chartData.weekly;
            if (!data) return;

            this.destroyChart(2);
            const ctx = document.getElementById('myChart2');
            if (!ctx) return;

            // Group earnings by week
            const weeklyEarnings = {};
            Object.entries(data).forEach(([date, price]) => {
                const weekStart = new Date(date);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                const weekKey = weekStart.toISOString().substring(0, 10);
                
                if (!weeklyEarnings[weekKey]) {
                    weeklyEarnings[weekKey] = 0;
                }
                weeklyEarnings[weekKey] += price;
            });

            const labels = Object.keys(weeklyEarnings);
            const dataValues = Object.values(weeklyEarnings);

            this.charts[2] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Weekly Earnings',
                        data: dataValues,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Week Starting'
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
        },

        async renderChart(chartType) {
            try {
                switch (chartType) {
                    case 1:
                        await this.renderDistributionChart();
                        break;
                    case 2:
                        await this.renderWeeklyChart();
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
    },

    beforeDestroy() {
        Object.keys(this.charts).forEach(chartType => {
            this.destroyChart(Number(chartType));
        });
    }
};

export default statsP;