import sqlite3 from "sqlite3";

const db = new sqlite3.Database("barangay.db", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Create the table if it doesn't exist
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
        add TEXT,
        delete TEXT,
        print TEXT,
        edit TEXT,
        search TEXT
    )`,
    (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        } else {
            console.log("Table created or already exists.");
        }
    }
);

export default db;