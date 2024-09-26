const adminDashboard ={
    template:`<div>
        welcome admin
    </div>`,
    data() {
        return {

        };
      },
      async mounted() {
        const id=2;
        const res=await fetch(window.location.origin+`/api/customer`,{
        method: "GET", 
          headers:{
            "Authentication-token":sessionStorage.getItem("token")
          }, 
      });

        if (res.ok) {
        const data = await res.json();
        console.log(data);  
        }
      },
}

export default adminDashboard;