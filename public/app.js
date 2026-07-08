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