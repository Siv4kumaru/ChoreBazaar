const ProfileP ={
    template:`<div>
<div class="container mt-5">
    <h2>Profile Update</h2>
    <div class="card text-center">
  <div class="card-header">
    <ul class="nav nav-tabs card-header-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <a class="nav-link active" id="active-tab" data-bs-toggle="tab" href="#active-content" role="tab" aria-controls="active-content" aria-selected="true">Details</a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link" id="link-tab" data-bs-toggle="tab" href="#link-content" role="tab" aria-controls="link-content" aria-selected="false">Change Password</a>
      </li>
    </ul>
  </div>
  <div class="card-body tab-content vw-70" id="myTabContent">
    <div class="tab-pane fade show active" id="active-content" role="tabpanel" aria-labelledby="active-tab">
      <h5 class="card-title">Personal Details</h5>
      <div class="card-text">
                <form>
 <div class="mb-3 d-flex align-items-center">
  <label for="name" class="form-label me-3" style="min-width: 100px;">Name</label>
  <input type="text" class="form-control" id="name" placeholder="Enter your name" v-model="name" required style="flex: 1;">
</div>

<div class="mb-3 d-flex align-items-center">
  <label for="phone" class="form-label me-3" style="min-width: 100px;">Phone</label>
  <input type="tel" class="form-control" id="phone" placeholder="Enter your phone number" v-model="phone" required style="flex: 1;">
</div>

<div class="mb-3 d-flex align-items-center">
  <label for="address" class="form-label me-3" style="min-width: 100px;">Address</label>
  <textarea class="form-control" id="address" rows="3" placeholder="Enter your address" v-model="address" required style="flex: 1;"></textarea>
</div>

 <div class="mb-3 d-flex align-items-center">
  <label for="exp" class="form-label me-3" style="min-width: 100px;">Experience</label>
  <input type="number" class="form-control" id="exp" placeholder="Enter your Experience in years" v-model="experience" required style="flex: 1;">
</div>


<div class="mb-3 d-flex align-items-center">
  <label for="pincode" class="form-label me-3" style="min-width: 100px;">Pincode</label>
  <input type="text" class="form-control" id="pincode" placeholder="Enter your pincode" v-model="pincode" required style="flex: 1;">
</div>


                <button type="submit" @click="deetup" class="btn btn-primary">Update</button>
            </form>
            </div>      
      
    </div>

    
    <div class="tab-pane fade container" id="link-content" role="tabpanel" aria-labelledby="link-tab">
      <h5 class="card-title">Remeber Your Password!</h5>
                    <form>
                <div class="mb-3 d-flex align-items-center">
                    <label for="current-password" class="form-label me-5" style="width: 150px;">Current Password</label>
                    <input type="password" class="form-control" id="current-password" name="current-password" required style="flex: 1;">
                </div>
                <div class="mb-3 d-flex align-items-center">
                    <label for="new-password" class="form-label me-5" style="width: 150px;">New Password</label>
                    <input type="password" class="form-control" id="new-password" name="new-password" required style="flex: 1;">
                </div>
                <div class="mb-3 d-flex align-items-center">
                    <label for="confirm-password" class="form-label me-5" style="width: 150px;">Confirm New Password</label>
                    <input type="password" class="form-control" id="confirm-password" name="confirm-password" required style="flex: 1;">
                </div>
                <button type="button" class="btn btn-primary" @click="changePassword">Change Password</button>
            </form>
      </div>
  </div>
</div>

</div>

        
    </div>`,
    data(){
        return{
            email:sessionStorage.getItem('email'),
            name:'',
            phone:'',
            address:'',
            pincode:'',
            experience:''
    };
},
methods:{
    async changePassword(){
        var current=$('#current-password').val();
        var newPass=$('#new-password').val();
        var confirm=$('#confirm-password').val();
        console.log(current,newPass,confirm);
        if(newPass!=confirm){
            alert("Password do not match");
            return;
        }
        const f = await fetch(window.location.origin + "/api/adminUpdate", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authentication-token": sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
                email: this.email,
                currentPassword: current,
                newPassword: newPass,
            }),
        });
        if (f.ok) {
            const res = await f.json();
            console.log(res);
            alert("Password Changed Successfully");
        } else {
            alert("Password Change Failed");
        }
    },
    async deetup(){
        
        const res = await fetch(window.location.origin + "/api/professional", {
            method: "PATCH",
            headers:{
                "Content-Type": "application/json",
                "Authentication-token": sessionStorage.getItem("token"),
            },
            body:JSON.stringify({
                experience:this.experience,
                email:this.email,
                name:this.name,
                phone:this.phone,
                address:this.address,
                pincode:this.pincode
            }),
        });
        if(res.ok){
            alert("Details Updated Successfully");
            const data=await res.json();
            console.log(data);
        }
    
    }
},
async mounted(){
    const res=await fetch(window.location.origin + "/api/professional", {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authentication-token": sessionStorage.getItem("token"),
        },
    });
    if(res.ok){
        const data=await res.json();
        for(let i in data){
            if(data[i].email==this.email){
                this.name=data[i].name;
                this.phone=data[i].phone;
                this.address=data[i].address;
                this.pincode=data[i].pincode;
                this.experience=data[i].experience;
            }
    }
    }
}

}

export default ProfileP;