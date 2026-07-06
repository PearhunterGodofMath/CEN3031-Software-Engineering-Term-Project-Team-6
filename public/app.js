const list = document.getElementById("list");

// 1. Show all users
document.getElementById("show_all").onclick = () => load();

// Load users from the server and show them
async function load(course) {
  const url = course ? `/api/users/${course}` : "/api/users";
  const res = await fetch(url);
  const users = await res.json();

  list.innerHTML = "";
  for (const user of users) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${user.name}:  ${user.course}</span>
      <button class="edit">Edit course</button>
      <button class="delete">Delete</button>`;

    li.querySelector(".edit").onclick = () => editUser(user.id);
    li.querySelector(".delete").onclick = () => deleteUser(user.id);
    list.appendChild(li);
  }
}

// 2. Create a user
document.getElementById("add-form").onsubmit = async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) return alert("Account creation failed");

  e.target.reset();
  load();
};

// 3. login
document.getElementById("login-form").onsubmit = async (e) => {
  e.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) return alert("Login failed!");

  const data = await response.json();
  alert(data.message);
  sessionStorage.setItem("userId", data.userId);
  
  e.target.reset();
};

// document.getElementById("add-form").onsubmit = async (e) => {
//   e.preventDefault();
//   const name = document.getElementById("name").value;
//   const course = document.getElementById("course").value;

//   await fetch("/api/users", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name, course }),
//   });

//   e.target.reset();
//   load();
// };

// Edit a user's course
async function editUser(id) {
  const course = prompt("New course?");
  if (!course) return;
  console.log(course);
  await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course }),
  });
  load();
}

// 4. Delete a user
async function deleteUser(id) {
  await fetch(`/api/users/${id}`, { method: "DELETE" });
  load();
}

// 5. Search by course
document.getElementById("search-form").onsubmit = (e) => {
  e.preventDefault();
  load(document.getElementById("search").value);
};

