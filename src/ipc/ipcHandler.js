const { ipcMain } = require("electron");
const db = require("../db/db");
const fs = require("fs");
const path = require("path");

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
        findings = ?,
        faceFileName = ?
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
        record.faceFileName,
        record.id,
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
        findings,
        faceFileName
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        record.faceFileName
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

ipcMain.handle("save-image", async (event, imageData) => {
  try {
    // Validate the Base64 image data
    if (!imageData.startsWith("data:image/")) {
      throw new Error("Invalid image data");
    }

    // Decode the Base64 image data
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Define the folder and file path
    const folderPath = path.join(__dirname, "../../public/assets/faces"); // Securely resolve the path
    const filePath = path.join(folderPath, `image-${Date.now()}.jpg`);

    // Ensure the folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true }); // Create the folder if it doesn't exist
    }

    // Save the image to the file
    fs.writeFileSync(filePath, buffer);
    console.log("Image saved successfully:", filePath);

    // Return success response
    return { success: true, filePath };
  } catch (error) {
    console.error("Error saving image:", error);
    throw error; // Throw the error so the renderer process can handle it
  }
});