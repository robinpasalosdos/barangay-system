import { ipcMain } from "electron";
import db from "../db/db.js";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        if (!imageData.startsWith("data:image/")) {
            throw new Error("Invalid image data");
        }

        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        const folderPath = path.resolve(__dirname, "../../public/assets/faces");
        const filePath = path.join(folderPath, `image-${Date.now()}.jpg`);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        fs.writeFileSync(filePath, buffer);
        console.log("Image saved successfully:", filePath);

        return { success: true, filePath };
    } catch (error) {
        console.error("Error saving image:", error);
        throw error;
    }
});