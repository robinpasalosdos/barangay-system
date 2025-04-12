import sqlite3 from "sqlite3";
sqlite3.verbose();

const db = new sqlite3.Database("barangay.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create the police_clearance table if it doesn't exist
console.log("Creating police_clearance table...");
db.run(
  `CREATE TABLE IF NOT EXISTS police_clearance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    policeClearanceNumber TEXT,
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
    faceFileName TEXT,
    onHold TEXT,
    user TEXT,
    createdTimestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  (err) => {
    if (err) {
      console.error("Error creating police_clearance table:", err.message);
    } else {
      console.log("Barangay Clearance table created or already exists.");
    }
  }
);

console.log("Creating warrant_booking table...");
db.run(
  `CREATE TABLE IF NOT EXISTS warrant_booking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lastName TEXT,
    firstName TEXT,
    middleName TEXT,
    dateOfBirth TEXT,
    placeOfBirth TEXT,
    age INTEGER,
    address TEXT,
    civilStatus TEXT,
    gender TEXT,
    citizenship TEXT,
    height TEXT,
    colorOfHair TEXT,
    complexion TEXT,
    weight TEXT,
    colorOfEyes TEXT,
    fpSyllabus TEXT,
    ccisNumber TEXT,
    crimeCommitted TEXT,
    committedDate TEXT,
    placeOfCrime TEXT,
    placeOfInquisition TEXT,
    remarks TEXT,
    createdTimestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  (err) => {
    if (err) {
      console.error("Error creating warrant_booking table:", err.message);
    } else {
      console.log("Warrant Booking table created or already exists.");
    }
  }
);

console.log("Creating rogue_directory table...");
db.run(
  `CREATE TABLE IF NOT EXISTS rogue_directory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lastName TEXT,
    firstName TEXT,
    middleName TEXT,
    dateOfBirth TEXT,
    age INTEGER,
    nickname TEXT,
    placeOfBirth TEXT,
    address TEXT,
    civilStatus TEXT,
    gender TEXT,
    citizenship TEXT,
    height TEXT,
    colorOfHair TEXT,
    complexion TEXT,
    weight TEXT,
    colorOfEyes TEXT,
    identifyingMarks TEXT,
    ccisNumber TEXT,
    crimeCommited TEXT,
    commitedDate TEXT,
    dateArrested TEXT,
    timeArrested TEXT,
    placeArrested TEXT,
    issuingCourtAndJudge TEXT,
    placeDetained TEXT,
    arrestingUnit TEXT,
    statusOfCase TEXT,
    sypnosisOfCriminalOffense TEXT,
    createdTimestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  (err) => {
    if (err) {
      console.error("Error creating rogue_directory table:", err.message);
    } else {
      console.log("Rogue Directory table created or already exists.");
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
    searchUSerAction INTEGER DEFAULT 0,
    createdTimestamp DATETIME DEFAULT CURRENT_TIMESTAMP
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


export default db;
