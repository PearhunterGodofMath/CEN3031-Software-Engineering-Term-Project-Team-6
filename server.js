import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// --- Database setup (async) ---
const db = await open({
  filename: "users.db",
  driver: sqlite3.Database,
});
// --- Add USER table ---
await db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  course TEXT NOT NULL
)`);
// --- Add APPLIANCE table ---
await db.exec(`CREATE TABLE IF NOT EXISTS appliance (
  name TEXT PRIMARY KEY NOT NULL,
  wattage INTEGER,
  hour_usage INTEGER,
  usage_date DATE
)`);

// --- App setup ---
const app = express();
app.use(express.json());        // read JSON request bodies
app.use(express.static("public")); // serve the HTML/CSS/JS

// Get all users
app.get("/api/users", async (req, res) => {
  const users = await db.all("SELECT * FROM users");
  console.log(users);
  res.json(users);
});

// Get users by course (class)
app.get("/api/users/:course", async (req, res) => {
  const users = await db.all("SELECT * FROM users WHERE course = ? COLLATE NOCASE", req.params.course.toUpperCase());
  res.json(users);
});

// Create a user
app.post("/api/users", async (req, res) => {
  const { username, password } = req.body;
  const result = await db.run('INSERT INTO users (username, password) VALUES (?, ?)', username, password);
  res.json({ id: result.lastID, username, message: 'Account created' });
  });

//login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE username = ? AND password = ?', username, password);
  if (passwordIncorrect) {
    return res.json({ success: false, message: "Invalid credentials" });
  }
  res.json({ success: true, message: "Welcome!" });
});

// app.post("/api/users", async (req, res) => {
//   console.log(req.body);
//   const { name, course } = req.body;
//   const result = await db.run("INSERT INTO users (name, course) VALUES (?, ?)", name, course);
//   res.json({ id: result.lastID, name, course });
// });

// Edit a user's course
app.put("/api/users/:id", async (req, res) => {
  await db.run("UPDATE users SET course = ? WHERE id = ?", req.body.course, req.params.id);
  res.json({ ok: true });
});

// Delete a user
app.delete("/api/users/:id", async (req, res) => {
  await db.run("DELETE FROM users WHERE id = ?", req.params.id);
  res.json({ ok: true });
});

// Add appliance
app.post("/api/appliance", async (req, res) => {
  console.log(req.body);
  const { name, wattage, hour_usage, usage_date } = req.body;
  const result = await db.run("INSERT INTO appliance (name, wattage, hour_usage, usage_date) VALUES (?, ?, ?, ?)", name, wattage, hour_usage, usage_date);
  res.json({ name, wattage, hour_usage, usage_date});
});

// Edit appliance
app.put("/api/appliance/:name/:wattage/:usage_date", async (req, res) => {
  await db.run("UPDATE appliance SET wattage = ?, usage_date = ? WHERE name = ?", req.params.wattage, req.params.usage_date, req.params.name);
  res.json({ ok: true });
});

// Delete appliance
app.delete("/api/appliance/:name", async (req, res) => {
  await db.run("DELETE FROM appliance WHERE name = ?", req.params.name);
  res.json({ ok: true });
});

app.listen(3000, () => console.log("Running on http://localhost:3000"));
