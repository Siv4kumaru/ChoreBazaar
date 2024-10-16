const services = {
    template: `
      <div @click="goToSearch()">
        <div class="card shadow-sm p-4 mb-4 services-card " >
          <div class="card-body ">
            <h3 class="card-title text-center mb-3 text-primary text">{{ name }}</h3>
            <p class="card-text text-secondary text">{{ description }}</p>
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
      }
    },
    data() {
      return {

      };
    },
    methods: {
      goToSearch(){
        this.$router.push({name:'searchC',params:{name:this.name}});
      }
    },
    mounted() {
      const style = document.createElement("style");
      style.textContent = `
        .services-card{
          max-width: 600px;
          margin: auto;
          border-radius: 15px;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .services-card:hover{
          transform: scale(1.02);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
      `;
      document.head.appendChild(style);
    },
  };
  
  export default services;