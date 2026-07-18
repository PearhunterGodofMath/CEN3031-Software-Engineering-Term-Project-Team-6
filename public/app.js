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
    
    const userID = sessionStorage.getItem("userId");
    const invalidMenuMessage = document.getElementById("invalid-value-message");

    const applianceName = document.getElementById("name");
    const applianceWattage = document.getElementById("wattage");
    if(applianceWattage.value < 0) {
      invalidMenuMessage.innerHTML = "Wattage must be a positive integer, data not saved";
      return;
    }
    const applianceHourUse = document.getElementById("hour-usage");
    const applianceUsageDate = document.getElementById("usage-date");

    console.log("Submit");

    const response = await fetch("/api/appliance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({name: applianceName.value, wattage: applianceWattage.value, hour_usage: applianceHourUse.value, usage_date: applianceUsageDate.value, user_id: userID}),
    });

    const data = await response.json();

    // if (!data.success) {
    //   console.error("Unable to add appliance");
    //   return;
    // }

    applianceName.value = "";
    applianceWattage.value = "";
    applianceHourUse.value = "";
    applianceUsageDate.value = "";
    invalidMenuMessage.innerHTML = "Appliance saved!";
    // console.log("Success");
  }
}

// Set new electricity price
const electricityPrice = document.getElementById("electricity-price");

function SetElectricityPrice(){
  const electricityPriceInput = document.getElementById("electricity-price-input");
  var price = electricityPriceInput.value ? electricityPriceInput.valueAsNumber : 0.15;
  sessionStorage.setItem("electricity_price", price);
  electricityPriceInput.value = "";
}

function ShowElectricityPrice(a){
  electricityPrice.innerHTML = `\$${a} per kWh`;
}

// Get Appliance
const getApplianceForm = document.getElementById("get-appliance-form");
async function Load(){
    const applianceName = document.getElementById("name").value;
    const applianceList = document.getElementById("appliance-list");
    const startDate = document.getElementById("start-date");
    const endDate = document.getElementById("end-date");
    const wattageAverage = document.getElementById("wattage-average");
    const costAverage = document.getElementById("cost-average");
    const dayCostAverage = document.getElementById("day-cost-average");

    // Need to get the ID of the current user
    const userID = sessionStorage.getItem("userId");

    var url = applianceName ? `/api/appliance/${applianceName}` : `api/appliance`;
    if(startDate.value && endDate.value){
      url += `/${startDate.value}/${endDate.value}`;
    }

    url += `/${userID}`;

    // Request for previous data
    const previousDelta = document.getElementById("previous-delta");
    var weekUrl = applianceName ? `/api/appliance/${applianceName}` : `api/appliance`;
    
    daysDiff = 0;
    if(startDate.value && endDate.value){
      startDateObj = new Date(startDate.value);
      endDateObj = new Date(endDate.value);
      dateDiff = endDateObj-startDateObj;
      daysDiff = dateDiff/(24*3600*1000);
      console.log(`datediff: ${daysDiff}`);
      
      timezoneOffset = startDateObj.getTimezoneOffset();
      newStartDate = new Date((startDateObj.setDate(startDateObj.getDate() - daysDiff)) - (timezoneOffset*60*1000));
      newEndDate = new Date((endDateObj.setDate(endDateObj.getDate() - daysDiff))- (timezoneOffset*60*1000));
      console.log(`newStartDate: ${newStartDate}`);
      console.log(`newEndDate: ${newEndDate}`);
      
      startString = newStartDate.toISOString().split('T')[0];
      endString = newEndDate.toISOString().split('T')[0];
      console.log(`startString: ${startString}`);
      console.log(`endString: ${endString}`);
      
      startDateObj.setDate(startString);
      endDateObj.setDate(endString);

      weekUrl += `/${startString}/${endString}`;
    }

    weekUrl += `/${userID}`;
    console.log(`url: ${url}`);
    console.log(`weekUrl: ${weekUrl}`);


    Promise.all([fetch(url), fetch(weekUrl)])
    .then(function(responses){
      return Promise.all(responses.map(function(response){
        return response.json();
      }));
    })
    .then(function(data){
      // Get the electricity price of the current user
      const storedElectricityPrice = sessionStorage.getItem("electricity_price");
      ShowElectricityPrice(storedElectricityPrice);

      // Variables for calculating cost average
      hours = 0;
      wattageSum = 0;
      wattAvg = 0;
      numDays = 0;
      appCount = data.length;

      applianceList.innerHTML = "";
      wattageAverage.innerHTML = "";
      for(const d of data[0]){
        const li = document.createElement("li");
        li.innerHTML=`<span>${d.name}, ${d.wattage}, ${d.hour_usage}, ${d.usage_date}</span>
        <button class="deleteAppliance">Delete</button>`;

        li.querySelector(".deleteAppliance").onclick = () => DeleteAppliance(d.name, d.usage_date, userID);
        applianceList.appendChild(li);
        wattageSum += d.wattage;
        hours += d.hour_usage;
        numDays++;
      }

      wattAvg = Math.round(wattageSum / appCount);
      wattageAverage.innerHTML = data.length > 0 ? `${wattAvg.toString()} W` : "Data not found";
      calc = (hours * (wattAvg * 0.001) * storedElectricityPrice);
      costAverage.innerHTML = data.length > 0 ? `\$${calc.toFixed(2)}` : "Data not found";
      dayCostAverage.innerHTML = data.length > 0 ? `\$${(calc/(numDays > 0 ? numDays : 1)).toFixed(2)}/day` : "Data not found";

      // Get summary of changes
      // Wattage values need to be compared to previous time range        
      weekWattageSum = 0;
      weekWattAvg = 0;
      weekHours = 0;
      weekNumDays = 0;
      weekCalc = 0;
      weekAppCount = data[1].length;

      for(const d of data[1]){
        weekWattageSum += d.wattage;
        weekHours += d.hour_usage;
        weekNumDays++;
      }

      weekWattAvg = Math.round(weekWattageSum / weekAppCount);
      weekCalc = (weekHours * (weekWattAvg * 0.001) * storedElectricityPrice);
      difference = calc - weekCalc;
      if(difference){
        previousDelta.innerHTML = `DRA is \$<span style="color: ${difference > 0 ? "red" : "green"}; font-weight: bold;">${Math.abs(difference.toFixed(2))} ${difference > 0 ? "higher" : "lower"}</span> than previous ${daysDiff} days.`;
      }
      else{
        previousDelta.innerHTML = "Data unavaiable";
      }
      console.log("Success");
    });
}

if(getApplianceForm){
  getApplianceForm.onsubmit = async(e) => {
    e.preventDefault();
    Load();
  }
}

async function DeleteAppliance(name, date, userID){
  url = `/api/appliance/${name}/${date}/${userID}`;
  await fetch(url, { method: "DELETE" });
  Load();
  console.log(`Delete ${name}, ${date}, ${userID}`);
}

// Clear Appliance Table
async function ClearApplianceTable(){
  await fetch(`/api/appliance/`, { method: "DELETE" });
  console.log("Clear appliance table");
}

// Clear Users Table
async function ClearUsersTable(){
  await fetch(`/api/users`, { method: "DELETE" });
  console.log("Clear user table");
}