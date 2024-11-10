import changedCommonTable from "../../components/changedCommonTable.js"; 

const proDashboard = {
  template: `<div>
    <h1>Professional Dashboard</h1>
      
    <!-- Nav tabs -->
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active"  id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Pending Requests</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Accepted/Ongoing</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="messages-tab" data-bs-toggle="tab" data-bs-target="#messages" type="button" role="tab" aria-controls="messages" aria-selected="false">Rejected/Cancelled</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="history-tab" data-bs-toggle="tab" data-bs-target="#history" type="button" role="tab" aria-controls="history" aria-selected="false" @click="history">History</button>
      </li>
    </ul>
      
    <!-- Tab panes -->
    <div v-if="data[0]">
      <div class="tab-content">
        <div class="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
          <changedCommonTable :condition="Pending" title="Pending Requests" :data="data" :selector="selector[0]" :columns="columns[0]">
            <template v-slot:actions="{ row }">
              <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
              <button class="btn btn-success btn-sm" @click="accept(row)">Accept</button>
              <button class="btn btn-danger btn-sm" @click="cancel(row)">Reject</button>
            </template>
          </changedCommonTable>
        </div>
        
        <div class="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
          <changedCommonTable :condition="Accepted" :title="title[0]" :data="data" :selector="selector[0]" :columns="columns[1]">
            <template v-slot:actions="{ row }">
              <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
              <button class="btn btn-danger btn-sm" @click="cancel(row)">Reject</button>
            </template>
          </changedCommonTable>
        </div>
        
        <div class="tab-pane" id="messages" role="tabpanel" aria-labelledby="messages-tab" tabindex="0">
          <changedCommonTable :condition="Rejected" title="Rejected/Cancelled" :data="data" :selector="selector[0]" :columns="columns[0]">
            <template v-slot:actions="{ row }">
              <button class="btn btn-primary btn-sm" @click="view(row)">View</button>
              <button v-if="row.serviceStatus!='Customer Cancellation'" class="btn btn-success btn-sm" @click="accept(row)">Accept</button>
            </template>
          </changedCommonTable>
        </div>

        <div class="tab-pane" id="history" role="tabpanel" aria-labelledby="history-tab" tabindex="0">
          <div class="alert alert-warning d-flex align-items-center">Redirecting you......</div>
        </div>
      </div>
    </div>

    <!-- Date Modal -->
    <div class="modal fade" id="dateModal" tabindex="-1" aria-labelledby="dateModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="dateModalLabel">Enter Date and Time</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="dateForm">
              <div class="mb-3">
                <label for="dateTimeInput" class="form-label">Date and Time</label>
                <input type="datetime-local" class="form-control" id="dateTimeInput" required
                       min="1900-01-01T00:00" max="2099-12-31T23:59">
              </div>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>`,

  data() {
    return {
      allServices: [],
      columns: [],
      title: [],
      data: [],
      selector: [],
    };
  },

  methods: {
    history() {
      this.$router.push({ 
        name: 'historyP', 
        params: { 
          data: JSON.stringify(this.data),
          columns: JSON.stringify(this.columns)
        }
      });
    },

    Pending(row) {
      return row.approve === 'Pending' && row.serviceStatus != 'Customer Cancellation';
    },

    Accepted(row) {
      return row.approve === 'accepted' && row.serviceStatus != 'Completed';
    },

    Rejected(row) {
      return row.serviceStatus === 'Customer Cancellation' || row.approve === 'Rejected';
    },

    async accept(row) {
      $('#dateModal').modal('show');

      $('#dateForm').off('submit').on('submit', async function (event) {
        event.preventDefault();

        const dateTimeValue = $('#dateTimeInput').val();
        const formattedDateTime = this.formatDateTime(dateTimeValue);

        $('#dateModal').modal('hide');

        const res = await fetch(window.location.origin + "/api/requests", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authentication-token": sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            id: row.id,
            approve: "accepted",
            serviceStatus: "Ongoing",
            dateofcompletion: formattedDateTime
          })
        });

        if (res.ok) {
          console.log("Request Accepted");
          const response = await res.json();
          console.log(response);

          const index = this.data.findIndex(item => item.id === row.id);
          if (index !== -1) {
            this.data[index].approve = "accepted";
            this.data[index].dateofcompletion = formattedDateTime;
          }
        } else {
          console.error("Error accepting request", res.status);
        }
      }.bind(this));
    },

    formatDateTime(dateTimeValue) {
      const date = new Date(dateTimeValue);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    async cancel(row) {
      const res = await fetch(window.location.origin + "/api/requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authentication-token": sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          id: row.id,
          approve: "Rejected",
          serviceStatus: "Professional Rejection",
        })
      });

      if (res.ok) {
        console.log("Request Rejected");
        const response = await res.json();
        console.log(response);
        const index = this.data.findIndex(item => item.id === row.id);
        if (index !== -1) {
          this.data[index].approve = "Rejected";
        }
      } else {
        console.error("Error cancelling request", res.status);
      }
    }
  },

  async mounted() {
    // Bootstrap tabbing initialization
    const triggerTabList = document.querySelectorAll('#myTab button');
    triggerTabList.forEach(triggerEl => {
      const tabTrigger = new bootstrap.Tab(triggerEl);
      triggerEl.addEventListener('click', event => {
        event.preventDefault();
        tabTrigger.show();
      });
    });

    try {
      const res2 = await fetch(window.location.origin + "/api/requests", {
        headers: {
          "Authentication-token": sessionStorage.getItem("token"),
        },
      });

      if (res2.ok) {
        var data2 = await res2.json();
        console.log(data2);
        
        for (let i in data2) {
          if (data2[i]["proemail"] == sessionStorage.getItem("email")) {
            this.data.push(data2[i]);
          }
        }

        this.columns.push([
          { data: "custemail", title: "Customer Email" },
          { data: "customerName", title: "Customer Name" },
          { data: "serviceName", title: "Service Name" },
          { data: "dateofrequest", title: "Date of Request" },
          { data: "servicePrice", title: "Service Price" },
          { data: "approve", title: "Approved" },
          { data: "serviceStatus", title: "Service Status" },
        ]);

        this.columns.push([
          { data: "custemail", title: "Customer Email" },
          { data: "customerName", title: "Customer Name" },
          { data: "serviceName", title: "Service Name" },
          { data: "dateofrequest", title: "Date of Request" },
          { data: "dateofcompletion", title: "Date of Completion" },
          { data: "servicePrice", title: "Service Price" },
          { data: "approve", title: "Approved" },
          { data: "serviceStatus", title: "Service Status" },
        ]);

        this.title.push("Ongoing Requests");
        this.selector.push("Ongoing Requests");
      } else {
        console.error("Error fetching requests", res2.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  },

  components: { changedCommonTable },
};

export default proDashboard;