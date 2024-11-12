const Profile ={
    template:`
<div class="container mt-0">
    <h2>Service Information</h2>
    <form>
        <div class="mb-3 ">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name" placeholder="Enter your name" required>
        </div>
        
        <div class="mb-3">
            <label for="phone" class="form-label">Phone</label>
            <input type="tel" class="form-control" id="phone" placeholder="Enter your phone number" required>
        </div>
        
        <div class="mb-3">
            <label for="address" class="form-label">Address</label>
            <textarea class="form-control" id="address" rows="3" placeholder="Enter your address" required></textarea>
        </div>
        
        <div class="mb-3">
            <label for="pincode" class="form-label">Pincode</label>
            <input type="text" class="form-control" id="pincode" placeholder="Enter your pincode" required>
        </div>
        
        <div class="mb-3">
            <label for="serviceName" class="form-label">Service Name</label>
            <input type="text" class="form-control" id="serviceName" placeholder="Enter the service name" required>
        </div>
        
        <div class="mb-3">
            <label for="experience" class="form-label">Experience</label>
            <input type="number" class="form-control" id="experience" placeholder="Enter your years of experience" required>
        </div>
        
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</div>

        
    </div>  `,
    data(){
        return{
            email:sessionStorage.getItem('email')
    };
}
}

export default Profile;