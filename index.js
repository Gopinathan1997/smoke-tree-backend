const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const cors = require("cors");

const path = require("path");

const { open } = require("sqlite");
const { appendFileSync } = require("fs");

const app = express();
const dbPath = path.join(__dirname, "database.db");

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create User table
    await db.run(`
      CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )
    `);

    // Create Address table
    await db.run(`
      CREATE TABLE IF NOT EXISTS Address (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        address TEXT,
        FOREIGN KEY (userId) REFERENCES User(id)
      )
    `);

    app.listen(3001, () => {
      console.log("Server running at http://localhost:3001");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// Signup route
app.post("/register", async (req, res) => {
  const { name, address } = req.body;
  
  try {
    // Check if user already exists
    const selectUserQuery = `SELECT * FROM User WHERE name = ?;`;
    const databaseUser = await db.get(selectUserQuery, [name]);

    if (databaseUser) {
      // If user exists, insert address
      const sql = `INSERT INTO Address (userId, address) VALUES (?, ?)`;
      const params = [databaseUser.id, address];
      await db.run(sql, params);

      return res.status(200).json({
        message: `${databaseUser.name}'s address added successfully.`,
      });
    } else {
      // Create new user if not exists
      const insertUserQuery = `INSERT INTO User (name) VALUES (?);`;
      const result = await db.run(insertUserQuery, [name]);
      const newUserId = result.lastID; // Get the new user's ID
      console.log(newUserId)

      // Now insert the address for the new user
      const addressSql = `INSERT INTO Address (userId, address) VALUES (?, ?)`;
      const addressParams = [newUserId, address];
      await db.run(addressSql, addressParams);

      return res
        .status(201)
        .json(`New user ${name} created and address added successfully.`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Get Address
app.get("/address", async (req, res) => {
  const selectQuery = `SELECT * from address natural join User`;
  const response = await db.all(selectQuery);
  res.json({ response });
});

module.exports = app;
