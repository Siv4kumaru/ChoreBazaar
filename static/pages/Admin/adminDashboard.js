const adminDashboard ={
    template:`<div>welcome admin </div>`,
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
        const res2=await fetch(window.location.origin+`/api/professional`,{
            method: "GET", 
            headers:{
                "Authentication-token":sessionStorage.getItem("token")
            }, 
        });
  
        if (res2.ok) {
            const data2 = await res2.json();
            console.log(data2);  
        }
        const res3=await fetch(window.location.origin+`/api/services`,{
            method: "GET", 
            headers:{
                "Authentication-token":sessionStorage.getItem("token")
            }, 
        });

        if (res3.ok) {
            const data3 = await res3.json();
            console.log(data3);  
        }
        const res4=await fetch(window.location.origin+`/api/requests`,{
            method: "GET", 
            headers:{
                "Authentication-token":sessionStorage.getItem("token")
            }, 
        });

        if (res4.ok) {
            const data4 = await res4.json();
            console.log(data4);  
        }
    },
}

export default adminDashboard;