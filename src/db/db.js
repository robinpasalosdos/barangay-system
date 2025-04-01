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
    username TEXT,
    password TEXT,
    policeClearance INTEGER DEFAULT 0,
    citizenInformation INTEGER DEFAULT 0,
    warrantBooking INTEGER DEFAULT 0,
    rogueDirectory INTEGER DEFAULT 0,
    userStatus INTEGER DEFAULT 0,
    addUSerAction INTEGER DEFAULT 0,
    deleteUSerAction INTEGER DEFAULT 0, 
    printUSerAction INTEGER DEFAULT 0,
    editUSerAction INTEGER DEFAULT 0,
    searchUSerAction INTEGER DEFAULT 0
  )`,
  (err) => {
    if (err) {
      console.error("Error creating users table:", err.message);
    } else {
      console.log("Users table created or already exists.");
    }
    console.log("Checking if admin user exists...");
    db.get(
      `SELECT COUNT(*) AS count FROM users WHERE username = ?`,
      ['admin'], // Check if 'admin' already exists
      (err, row) => {
        if (err) {
          console.error("Error checking for existing user:", err.message);
        } else {
          console.log("Admin user count:", row.count); // Log the result of count query
          if (row.count === 0) {
            // Proceed to insert if the user doesn't exist
            console.log("Admin user doesn't exist, inserting...");
            db.run(
              `INSERT INTO users (
                username,
                password,
                policeClearance,
                citizenInformation,
                warrantBooking,
                rogueDirectory,
                userStatus,
                addUSerAction,
                deleteUSerAction,
                printUSerAction,
                editUSerAction,
                searchUSerAction
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                'admin',            // username
                '123',              // password
                1,                  // policeClearance (default 0)
                1,                  // citizenInformation (default 0)
                1,                  // warrantBooking (default 0)
                1,                  // rogueDirectory (default 0)
                1,                  // userStatus (default 0)
                1,                  // addUSerAction (default 0)
                1,                  // deleteUSerAction (default 0)
                1,                  // printUSerAction (default 0)
                1,                  // editUSerAction (default 0)
                1                   // searchUSerAction (default 0)
              ],
              (err) => {
                if (err) {
                  console.error("Error inserting record:", err.message); // Log any error from the insert
                } else {
                  console.log("Admin user inserted.");
                }
              }
            );
          } else {
            console.log("Admin user already exists.");
          }
        }
      }
    );
  }
);

// Check if the admin user already exists


module.exports = db;
