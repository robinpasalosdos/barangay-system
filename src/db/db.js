const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("barangay.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create the barangay_clearance table if it doesn't exist
console.log("Creating barangay_clearance table...");
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
    findings TEXT,
    faceFileName TEXT
  )`,
  (err) => {
    if (err) {
      console.error("Error creating barangay_clearance table:", err.message);
    } else {
      console.log("Barangay Clearance table created or already exists.");
    }
  }
);

// Create the users table if it doesn't exist
console.log("Creating users table...");
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userName TEXT,
    password TEXT,
    policeClearance TEXT,
    citizenInformation TEXT,
    warrantBooking TEXT,
    rogueDirectory TEXT,
    userStatus TEXT,
    addUSerAction TEXT,
    deleteUSerAction TEXT, 
    printUSerAction TEXT,
    editUSerAction TEXT,
    searchUSerAction TEXT
  )`,
  (err) => {
    if (err) {
      console.error("Error creating users table:", err.message);
    } else {
      console.log("Users table created or already exists.");
    }
  }
);

module.exports = db;