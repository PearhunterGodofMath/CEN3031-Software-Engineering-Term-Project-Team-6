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
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  electricity_price FLOAT NOT NULL
)`);
// --- Add APPLIANCE table ---
await db.exec(`CREATE TABLE IF NOT EXISTS appliance (
  name TEXT NOT NULL,
  wattage INTEGER NOT NULL,
  hour_usage INTEGER NOT NULL,
  usage_date DATE,
  appliance_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER
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

// Get user ID
app.get("/api/users/:name", async (req, res) => {
  const users = await db.all("SELECT id FROM users WHERE username = ?", req.params.name);
  console.log(`User: ${req.params.name}`);
  res.json(users);
});

// Create a user
app.post("/api/users", async (req, res) => {
  const { username, password } = req.body;
  const result = await db.run('INSERT INTO users (username, password, electricity_price) VALUES (?, ?, ?)', username, password, 0.16);
  res.json({ id: result.lastID, username, message: 'Account created' });
  });

//login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE username = ? AND password = ?', username, password);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  res.json({ success: true, message: "Welcome!", userId: user.id, electricityPrice: user.electricity_price});
});

// Delete a user
app.delete("/api/users/:id", async (req, res) => {
  await db.run("DELETE FROM users WHERE id = ?", req.params.id);
  res.json({ ok: true });
});

// Set electricity price
app.put("/api/users/:id/:price", async (req, res) => {
  await db.run("UPDATE users SET electricity_price = ? WHERE id = ?", req.params.price, req.params.id);
  res.json({ ok: true });
});

// Add appliance
app.post("/api/appliance", async (req, res) => {
  console.log(req.body);
  const { name, wattage, hour_usage, usage_date , user_id} = req.body;
  const result = await db.run("INSERT INTO appliance (name, wattage, hour_usage, usage_date, user_id) VALUES (?, ?, ?, ?, ?)", name, wattage, hour_usage, usage_date, user_id);
  res.json({ name, wattage, hour_usage, usage_date, user_id});
});

// Edit appliance
app.put("/api/appliance/:name/:wattage/:usage_date", async (req, res) => {
  await db.run("UPDATE appliance SET wattage = ?, usage_date = ? WHERE name = ?", req.params.wattage, req.params.usage_date, req.params.name);
  res.json({ ok: true });
});

// Get all appliance info
app.get("/api/appliance/:user_id", async (req, res) => {
  const appliances = await db.all("SELECT * FROM appliance WHERE user_id = ?", req.params.user_id);
  res.json(appliances);
});

// Get specific appliance info
app.get("/api/appliance/:name:/user_id", async (req, res) => {
  const appliances = await db.all("SELECT * FROM appliance WHERE name = ? AND user_id = ?", req.params.name, req.params.user_id);
  res.json(appliances);
});

// Get ALL appliance info within date range
app.get("/api/appliance/:start_date/:end_date/:user_id", async (req, res) => {
  const appliances = await db.all("SELECT * FROM appliance WHERE user_id = ? AND usage_date BETWEEN ? AND ?",req.params.user_id, req.params.start_date, req.params.end_date);
  res.json(appliances);
});

// Get SPECIFIC appliance info within date range
app.get("/api/appliance/:name/:start_date/:end_date:/user_id", async (req, res) => {
  const appliances = await db.all("SELECT * FROM appliance WHERE name = ? AND user_id = ? AND usage_date BETWEEN ? AND ?", req.params.name, req.params.user_id, req.params.start_date, req.params.end_date);
  res.json(appliances);
});

// Delete appliance
app.delete("/api/appliance/:name", async (req, res) => {
  await db.run("DELETE FROM appliance WHERE name = ?", req.params.name);
  res.json({ ok: true });
});

// Clear all entries from appliance table
app.delete("/api/appliance/", async (req, res) => {
  await db.run("DROP TABLE IF EXISTS appliance");
  res.json({ ok: true });
});

// Delete user table
app.delete("/api/users", async (req, res) => {
  await db.run("DROP TABLE IF EXISTS users");
  res.json({ ok: true });
});

app.listen(3000, () => console.log("Running on http://localhost:3000"));
