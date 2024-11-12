const services = {
  template: `
    <div @click="goToSearch()">
      <div class="card shadow-lg p-4 mb-4 services-card mx-3">
        <div class="card-body">
      <h3 class="card-title text-center mb-3 " style="color: #FAC012;">{{ name }}</h3>
          <p class="card-text text-muted">{{ description }}</p>
        </div>
        <div class="card-footer text-muted text-end">
          <small>Base Amount: ₹{{ price }}</small>
        </div>
      </div>
    </div>
  `,
  props: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      required: true,
    },
  },
  methods: {
    goToSearch() {
      this.$router.push({ name: 'searchC', params: { name: this.name } });
    }
  },
  mounted() {
    const style = document.createElement("style");
    style.textContent = `
      .services-card {
        max-width: 600px;
        margin: auto;
        border-radius: 20px;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        background-color: #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .services-card:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      }

      .card-body {
        padding: 20px;
      }

      .card-title {
        font-size: 1.5rem;
        font-weight: bold;
        color: #007bff;
      }

      .card-text {
        font-size: 1rem;
        color: #6c757d;
      }

      .card-footer {
        background-color: #f8f9fa;
        font-size: 0.9rem;
      }

      .text-end {
        text-align: right;
      }

      .card-footer small {
        font-weight: 500;
      }
    `;
    document.head.appendChild(style);
  },
};

export default services;
