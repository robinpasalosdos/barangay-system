const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Initialize SQLite database
const db = new sqlite3.Database("barangay.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create the table if it doesn't exist
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

let mainWindow;

app.on("ready", () => {
  console.log("Electron app is ready");
  // Get the primary display's work area size
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Create the main window
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Preload script for IPC
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  // Load the React app
  mainWindow.loadURL("http://localhost:5173");

  // Open DevTools (optional, for debugging)
  // mainWindow.webContents.openDevTools();
});

// IPC handlers for database operations
ipcMain.handle("fetch-records", async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM barangay_clearance", [], (err, rows) => {
      if (err) {
        console.error("Error fetching records:", err.message);
        reject(err.message);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle("update-record", async (event, record) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE barangay_clearance SET
        barangayClearanceNumber = ?,
        documentDate = ?,
        orDate = ?,
        documentNumber = ?,
        lastName = ?,
        firstName = ?,
        middleName = ?,
        birthdate = ?,
        birthplace = ?,
        age = ?,
        address = ?,
        civilStatus = ?,
        gender = ?,
        purpose = ?,
        cedulaNumber = ?,
        placeIssued = ?,
        dateIssued = ?,
        tinNumber = ?,
        orNumber = ?,
        contactNumber = ?,
        findings = ?
      WHERE id = ?`,
      [
        record.barangayClearanceNumber,
        record.documentDate,
        record.orDate,
        record.documentNumber,
        record.lastName,
        record.firstName,
        record.middleName,
        record.birthdate,
        record.birthplace,
        record.age,
        record.address,
        record.civilStatus,
        record.gender,
        record.purpose,
        record.cedulaNumber,
        record.placeIssued,
        record.dateIssued,
        record.tinNumber,
        record.orNumber,
        record.contactNumber,
        record.findings,
        record.id, // Use the record's ID for the WHERE clause
      ],
      function (err) {
        if (err) {
          console.error("Error updating record:", err.message);
          reject(err.message);
        } else {
          resolve({ message: "Record updated successfully." });
        }
      }
    );
  });
});

ipcMain.handle("add-record", async (event, record) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO barangay_clearance (
        barangayClearanceNumber,
        documentDate,
        orDate,
        documentNumber,
        lastName,
        firstName,
        middleName,
        birthdate,
        birthplace,
        age,
        address,
        civilStatus,
        gender,
        purpose,
        cedulaNumber,
        placeIssued,
        dateIssued,
        tinNumber,
        orNumber,
        contactNumber,
        findings
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.barangayClearanceNumber,
        record.documentDate,
        record.orDate,
        record.documentNumber,
        record.lastName,
        record.firstName,
        record.middleName,
        record.birthdate,
        record.birthplace,
        record.age,
        record.address,
        record.civilStatus,
        record.gender,
        record.purpose,
        record.cedulaNumber,
        record.placeIssued,
        record.dateIssued,
        record.tinNumber,
        record.orNumber,
        record.contactNumber,
        record.findings,
      ],
      function (err) {
        if (err) {
          console.error("Error adding record:", err.message);
          reject(err.message);
        } else {
          resolve({ id: this.lastID });
        }
      }
    );
  });
});

ipcMain.handle("delete-record", async (event, id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM barangay_clearance WHERE id = ?", [id], (err) => {
      if (err) {
        console.error("Error deleting record:", err.message);
        reject(err.message);
      } else {
        resolve({ message: "Record deleted successfully." });
      }
    });
  });
});

// Handle app close
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    app.emit("ready");
  }
});
