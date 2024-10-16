const ProfileA ={
    template:`<div>
<body class="bg-light d-flex align-items-center justify-content-center" style="min-height: 100vh;">
    <div class="card shadow-sm" style="max-width: 400px; width: 100%;">
        <div class="card-body">
            <div class="text-center mb-4">
                <img :src="'https://api.dicebear.com/9.x/initials/svg?seed='+this.email+'&radius=50'" alt="User Avatar" class="rounded-circle" width="96" height="96">
            </div>
            <h2 class="card-title text-center mb-4">Change Password</h2>
            <form>
                <div class="mb-3">
                    <label for="current-password" class="form-label">Current Password</label>
                    <input type="password" class="form-control" id="current-password" name="current-password" required>
                </div>
                <div class="mb-3">
                    <label for="new-password" class="form-label">New Password</label>
                    <input type="password" class="form-control" id="new-password" name="new-password" required>
                </div>
                <div class="mb-4">
                    <label for="confirm-password" class="form-label">Confirm New Password</label>
                    <input type="password" class="form-control" id="confirm-password" name="confirm-password" required>
                </div>
                <button type="button" class="btn btn-primary w-100 " @click="changePassword">Change Password</button>
            </form>
        </div>
    </div>
</body>

        
    </div>`,
    data(){
        return{
            email:sessionStorage.getItem('email')
    };
},
methods:{
    async changePassword(){
        var current=$('#current-password').val();
        var newPass=$('#new-password').val();
        var confirm=$('#confirm-password').val();
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
    }
}
}

export default ProfileA;