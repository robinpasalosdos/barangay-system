const sqlite3 = require("sqlite3").verbose();

// Create or open the database
const db = new sqlite3.Database("./barangay_clearance.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create the table if it doesn't exist
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS barangay_clearance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barangayClearanceNumber TEXT,
      documentDate TEXT,
      orDate TEXT,
      documentNumber TEXT,
      lastName TEXT,
      firstName TEXT,
      middleName TEXT,
      birthdate TEXT,
      birthplace TEXT,
      age INTEGER,
      address TEXT,
      civilStatus TEXT,
      gender TEXT,
      purpose TEXT,
      cedulaNumber TEXT,
      placeIssued TEXT,
      dateIssued TEXT,
      tinNumber TEXT,
      orNumber TEXT,
      contactNumber TEXT,
      findings TEXT
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Table created or already exists.");
      }
    }
  );
});

module.exports = db;