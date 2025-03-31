const { ipcMain } = require("electron");
const db = require("../db/db");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const allQuery = promisify(db.all.bind(db));
const runQuery = promisify(db.run.bind(db));

const columns = [
  "barangayClearanceNumber",
  "documentDate",
  "orDate",
  "documentNumber",
  "lastName",
  "firstName",
  "middleName",
  "birthdate",
  "birthplace",
  "age",
  "address",
  "civilStatus",
  "gender",
  "purpose",
  "cedulaNumber",
  "placeIssued",
  "dateIssued",
  "tinNumber",
  "orNumber",
  "contactNumber",
  "findings",
  "faceFileName"
];

// Add Record Handler
ipcMain.handle("add-police-clearance-record", async (event, record) => {
  try {
    const placeholders = columns.map(() => "?").join(", ");
    const sql = `INSERT INTO barangay_clearance (${columns.join(", ")}) VALUES (${placeholders})`;
    const values = columns.map((col) => record[col]);

    await runQuery(sql, values);
    return { message: "Record added successfully." };
  } catch (err) {
    console.error("Error adding record:", err);
    return { error: "Failed to add record. " + err.message };
  }
});

// Update Record Handler
ipcMain.handle("update-police-clearance-record", async (event, record) => {
  try {
    const setClause = columns.map((col) => `${col} = ?`).join(", ");
    const sql = `UPDATE barangay_clearance SET ${setClause} WHERE id = ?`;
    const values = [...columns.map((col) => record[col]), record.id];

    await runQuery(sql, values);
    return { message: "Record updated successfully." };
  } catch (err) {
    console.error("Error updating record:", err);
    return { error: "Failed to update record. " + err.message };
  }
});

ipcMain.handle("fetch-police-clearance-records", async () => {
  try {
    const rows = await allQuery("SELECT * FROM barangay_clearance");
    return rows;
  } catch (err) {
    console.error("Error fetching records:", err.message);
    return { error: "Failed to fetch records. " + err.message };
  }
});

// Delete Record
ipcMain.handle("delete-police-clearance-record", async (event, id) => {
  try {
    await runQuery("DELETE FROM barangay_clearance WHERE id = ?", [id]);
    return { message: "Record deleted successfully." };
  } catch (err) {
    console.error("Error deleting record:", err.message);
    return { error: "Failed to delete record. " + err.message };
  }
});

ipcMain.handle("save-police-clearance-image", async (event, imageData) => {
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