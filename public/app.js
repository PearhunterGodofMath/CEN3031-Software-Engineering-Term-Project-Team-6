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
    sessionStorage.setItem("electricity_price", data.electricityPrice);

    window.location.href = "utilitiesTable.html";
  };
}

// Add Appliance
const addApplianceForm = document.getElementById("add-appliance-form");

if(addApplianceForm){
  addApplianceForm.onsubmit = async(e) => {
    e.preventDefault();

    const invalidMenuMessage = document.getElementById("invalid-value-message");

    const applianceName = document.getElementById("name").value;
    const applianceWattage = document.getElementById("wattage").value;
    if(applianceWattage < 0) {
      invalidMenuMessage.innerHTML = "Wattage must be a positive integer, data not saved";
      return;
    }
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

// Set new electricity price
function SetElectricityPrice(){
  const electricityPriceInput = document.getElementById("electricity-price-input");
  var price = electricityPriceInput.value ? electricityPriceInput.value : 0.15;
  sessionStorage.setItem("electricity_price", price);
  console.log(`electricityPriceInput: ${price}`);
}

// Get Appliance
const getApplianceForm = document.getElementById("get-appliance-form");

if(getApplianceForm){
  getApplianceForm.onsubmit = async(e) => {
    e.preventDefault();

    const applianceName = document.getElementById("name").value;
    const applianceList = document.getElementById("appliance-list");
    const startDate = document.getElementById("start-date");
    const endDate = document.getElementById("end-date");
    const wattageAverage = document.getElementById("wattage-average");
    const electricityPrice = document.getElementById("electricity-price");
    const costAverage = document.getElementById("cost-average");
    
    
    console.log("Submit");

    var url = applianceName ? `/api/appliance/${applianceName}` : `api/appliance`;
    if(startDate.value && endDate.value){
      url += `/${startDate.value}/${endDate.value}`;
    }

    console.log(url);

    const response = await fetch(url);
    const data = await response.json();
    // if (!data.success) {
    //   console.error("Unable to get appliance");
    //   return;
    // }

    // Need to get the ID of the current user
    const userID = sessionStorage.getItem("userId");

    // Get the electricity price of the current user
    const electricity_price = sessionStorage.getItem("electricity_price");
    electricityPrice.innerHTML = electricity_price;
    console.log(`userID: ${userID}\nelectricityPrice: ${electricity_price}`);

    // Variables for calculating cost average
    hours = 0;
    wattageSum = 0;
    appCount = data.length;

    applianceList.innerHTML = "";
    wattageAverage.innerHTML = "";
    for(const d of data){
      const li = document.createElement("li");
      li.innerHTML=`<span>${d.name}, ${d.wattage}, ${d.hour_usage}, ${d.usage_date}</span>`;

      applianceList.appendChild(li);
      wattageSum += d.wattage;
      hours += d.hour_usage;
    }

    wattageAverage.innerHTML = `${Math.round(wattageSum / appCount).toString()} W`;

     
    costAverage.innerHTML = `\$${(hours * (wattageSum * 0.001) * electricity_price).toFixed(2)}`;

    console.log("Success");
  }
}