// Create Account
const createAccountForm = document.getElementById("create-account-form");

if (createAccountForm) {
  createAccountForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if(!response.ok) {
      return alert(data.message);
    }

    alert("Account created successfully!");

    window.location.href = "loginScreen.html"; // Redirect to login page after successful account creation
  };
}

// Login
const loginForm = document.getElementById("login-form");

if (loginForm) {

  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    const message = document.getElementById("login-message");

    if (!data.success) {
      message.textContent = "Invalid username or password";
      return;
    }

    sessionStorage.setItem("userId", data.userId);

    window.location.href = "utilitiesTable.html";
  };
}

// Add Appliance
const addApplianceForm = document.getElementById("add-appliance-form");

if(addApplianceForm){
  addApplianceForm.onsubmit = async(e) => {
    e.preventDefault();

    const applianceName = document.getElementById("name").value;
    const applianceWattage = document.getElementById("wattage").value;
    const applianceHourUse = document.getElementById("hour-usage").value;
    const applianceUsageDate = document.getElementById("usage-date").value;

    console.log("Submit");

    const response = await fetch("/api/appliance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({name: applianceName, wattage: applianceWattage, hour_usage: applianceHourUse, usage_date: applianceUsageDate}),
    });

    const data = await response.json();

    if (!data.success) {
      console.error("Unable to add appliance");
      return;
    }

    console.log("Success");
  }
}
else console.error("No document found");

// Get Appliance
const getApplianceForm = document.getElementById("get-appliance-form");

if(getApplianceForm){
  getApplianceForm.onsubmit = async(e) => {
    e.preventDefault();

    const applianceName = document.getElementById("name").value;
    const applianceList = document.getElementById("appliance-list");
    console.log("Submit");

    const url = applianceName ? "/api/appliance/${applianceName}" : "api/appliance";
    const response = await fetch(url);

    const data = await response.json();

    applianceList.innerHTML = "";
    for(const d of data){
      const li = document.createElement("li");
      li.innerHTML=`<span>${d.name}, ${d.wattage}, ${d.hour_usage}, ${d.usage_date}</span>`;

      applianceList.appendChild(li);
    }

    if (!data.success) {
      console.error("Unable to get appliance");
      return;
    }

    console.log("Success");
  }
}
else console.error("No document found");