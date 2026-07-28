const API_URL = "http://localhost:3000/api/applications";
let statusChart;
const form = document.getElementById("applicationForm");
const container = document.getElementById("applicationsContainer");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const exportBtn = document.getElementById("exportBtn");

exportBtn.addEventListener("click", exportCSV);
const sortApplications =
document.getElementById("sortApplications");
const themeToggle =
document.getElementById("themeToggle");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.querySelector(".close");


if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");

    themeToggle.textContent="☀️";

}
themeToggle.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    const dark=
        document.body.classList.contains("dark");

    themeToggle.textContent=
        dark ? "☀️":"🌙";

    localStorage.setItem(
        "theme",
        dark ? "dark":"light"
    );

});

sortApplications.addEventListener("change", filterApplications);

const toast = document.getElementById("toast");

function showToast(message, type = "success") {

    if (!toast) return;

    toast.textContent = message;

    toast.className = "";

    toast.classList.add("show", type);

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
let editingId = null;
const submitButton = form.querySelector("button");

let applications = [];
async function loadApplications() {
  try {
    const response = await fetch(API_URL);

    applications = await response.json();

    filterApplications();
  } catch (error) {
    console.error(error);
  }
}

loadApplications();
form.addEventListener("submit", addApplication);
searchInput.addEventListener("input", filterApplications);
filterStatus.addEventListener("change", filterApplications);

function displayApplications(data) {
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = `
        <div class="empty-state">
            <h2>📭 No Applications Found</h2>
            <p>Try changing your search or filter.</p>
        </div>
        `;

    return;
  }

  data.forEach((application) => {
    container.innerHTML += `

        <div class="application-card">

            <h3>${application.company}</h3>

            <p><strong>Position:</strong> ${application.position}</p>

            <p><strong>Location:</strong> ${application.location}</p>

            <p>
    <strong>Status:</strong>
    <span class="status ${application.status.toLowerCase()}">
        ${application.status}
    </span>
</p>
            <p><strong>Salary:</strong> ${application.salary}</p>

            <p><strong>Date:</strong> ${application.dateApplied}</p>

            <p>${application.notes}</p>

       <div class="actions">

    <button
        class="view-btn"
        onclick="viewApplication(${application.id})">
        View
    </button>

    <button
        class="edit-btn"
        onclick="editApplication(${application.id})">
        Edit
    </button>

    <button
        class="delete-btn"
        onclick="deleteApplication(${application.id})">
        Delete
    </button>

</div>

        </div>

        `;
  });
}

function updateStats(data) {
  document.getElementById("totalCount").textContent = data.length;

  document.getElementById("appliedCount").textContent = data.filter(
    (app) => app.status === "Applied",
  ).length;

  document.getElementById("interviewCount").textContent = data.filter(
    (app) => app.status === "Interview",
  ).length;

  document.getElementById("offerCount").textContent = data.filter(
    (app) => app.status === "Offer",
  ).length;
}

function updateChart(data) {
  const applied = data.filter((app) => app.status === "Applied").length;

  const interview = data.filter((app) => app.status === "Interview").length;

  const offer = data.filter((app) => app.status === "Offer").length;

  const rejected = data.filter((app) => app.status === "Rejected").length;

  if (statusChart) {
    statusChart.destroy();
  }

  const ctx = document.getElementById("statusChart").getContext("2d");

  statusChart = new Chart(ctx, {
    type: "doughnut",

    data: {
      labels: ["Applied", "Interview", "Offer", "Rejected"],

      datasets: [
        {
          data: [applied, interview, offer, rejected],

          backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"],
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

async function addApplication(e) {
  e.preventDefault();

  const applicationData = {
    company: document.getElementById("company").value,
    position: document.getElementById("position").value,
    location: document.getElementById("location").value,
    status: document.getElementById("status").value,
    salary: document.getElementById("salary").value,
    dateApplied: document.getElementById("dateApplied").value,
    notes: document.getElementById("notes").value,
  };

  // Save edit state BEFORE resetting it
  const isEditing = editingId !== null;

  const url = isEditing ? `${API_URL}/${editingId}` : API_URL;

  const method = isEditing ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    form.reset();

    editingId = null;

    submitButton.textContent = "Add Application";

    await loadApplications();

    showToast(
      isEditing
        ? " Application updated successfully!"
        : " Application added successfully!",
    );
  } catch (error) {
    console.error(error);

    showToast(" Something went wrong!", "error");
  }
}

async function deleteApplication(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this application?",
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    await loadApplications();

    showToast(" Application deleted successfully!");
  } catch (error) {
    console.error(error);

    showToast("Unable to delete application.", "error");
  }
}
function editApplication(id) {
  const application = applications.find((app) => app.id === id);

  if (!application) {
    showToast("Application not found", "error");
    return;
  }

  document.getElementById("company").value = application.company;
  document.getElementById("position").value = application.position;
  document.getElementById("location").value = application.location;
  document.getElementById("status").value = application.status;
  document.getElementById("salary").value = application.salary;
  document.getElementById("dateApplied").value = application.dateApplied;
  document.getElementById("notes").value = application.notes;

  editingId = id;

  submitButton.textContent = "Update Application";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  showToast("Editing application...");
}

function filterApplications() {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedStatus = filterStatus.value;

  const filtered = applications.filter((application) => {
    const company = application.company.toLowerCase();
    const position = application.position.toLowerCase();

    const matchesSearch =
      company.includes(searchText) || position.includes(searchText);

    const matchesStatus =
      selectedStatus === "All" || application.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });
  switch (sortApplications.value) {

    case "newest":

        filtered.sort(
            (a, b) =>
                new Date(b.dateApplied) -
                new Date(a.dateApplied)
        );

        break;

    case "oldest":

        filtered.sort(
            (a, b) =>
                new Date(a.dateApplied) -
                new Date(b.dateApplied)
        );

        break;

    case "company":

        filtered.sort(
            (a, b) =>
                a.company.localeCompare(b.company)
        );

        break;

}
  displayApplications(filtered);
  updateStats(filtered);

  updateChart(filtered);
}

function exportCSV() {

    if (applications.length === 0) {

        showToast("No applications to export.", "error");
        return;

    }

    const headers = [
        "Company",
        "Position",
        "Location",
        "Status",
        "Salary",
        "Date Applied",
        "Notes"
    ];

    const rows = applications.map(app => [

        app.company,
        app.position,
        app.location,
        app.status,
        app.salary,
        app.dateApplied,
        app.notes

    ]);

    const csv = [

        headers.join(","),

        ...rows.map(row => row.join(","))

    ].join("\n");

    const blob = new Blob([csv], {

        type: "text/csv"

    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "job-applications.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showToast("CSV exported successfully!");

}

function viewApplication(id){

    const application = applications.find(app => app.id === id);

    if(!application) return;

    modalBody.innerHTML = `

        <h3>${application.company}</h3>

        <p><strong>Position:</strong> ${application.position}</p>

        <p><strong>Location:</strong> ${application.location}</p>

        <p><strong>Status:</strong> ${application.status}</p>

        <p><strong>Salary:</strong> ${application.salary}</p>

        <p><strong>Date Applied:</strong> ${application.dateApplied}</p>

        <p><strong>Notes:</strong> ${application.notes}</p>

    `;

    modal.classList.add("show");

}
closeModal.onclick = function(){

    modal.classList.remove("show");

};
window.onclick = function(event){

    if(event.target === modal){

        modal.classList.remove("show");

    }

};