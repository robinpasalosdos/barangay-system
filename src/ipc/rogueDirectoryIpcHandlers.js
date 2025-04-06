import { ipcMain } from "electron";
import db from "../db/db.js";
import { promisify } from "util";

const allQuery = promisify(db.all.bind(db));
const runQuery = promisify(db.run.bind(db));

// Rogue Directory Columns
const rogueColumns = [
  "lastName",
  "firstName",
  "middleName",
  "dateOfBirth",
  "age",
  "nickname",
  "placeOfBirth",
  "address",
  "civilStatus",
  "gender",
  "citizenship",
  "height",
  "colorOfHair",
  "complexion",
  "weight",
  "colorOfEyes",
  "identifyingMarks",
  "ccisNumber",
  "crimeCommited",
  "commitedDate",
  "dateArrested",
  "timeArrested",
  "placeArrested",
  "issuingCourtAndJudge",
  "placeDetained",
  "arrestingUnit",
  "statusOfCase",
  "sypnosisOfCriminalOffense"
];

// Add Record Handler
ipcMain.handle("add-rogue-directory-record", async (event, record) => {
  try {
    const placeholders = rogueColumns.map(() => "?").join(", ");
    const sql = `INSERT INTO rogue_directory (${rogueColumns.join(", ")}) VALUES (${placeholders})`;
    const values = rogueColumns.map((col) => record[col]);

    await runQuery(sql, values);
    return { message: "Rogue record added successfully." };
  } catch (err) {
    console.error("Error adding rogue record:", err);
    return { error: "Failed to add rogue record. " + err.message };
  }
});

// Update Record Handler
ipcMain.handle("update-rogue-directory-record", async (event, record) => {
  try {
    const setClause = rogueColumns.map((col) => `${col} = ?`).join(", ");
    const sql = `UPDATE rogue_directory SET ${setClause} WHERE id = ?`;
    const values = [...rogueColumns.map((col) => record[col]), record.id];

    await runQuery(sql, values);
    return { message: "Rogue record updated successfully." };
  } catch (err) {
    console.error("Error updating rogue record:", err);
    return { error: "Failed to update rogue record. " + err.message };
  }
});

// Fetch Records
ipcMain.handle("fetch-rogue-directory-records", async () => {
  try {
    const rows = await allQuery("SELECT * FROM rogue_directory");
    return rows;
  } catch (err) {
    console.error("Error fetching rogue records:", err.message);
    return { error: "Failed to fetch rogue records. " + err.message };
  }
});

// Delete Record
ipcMain.handle("delete-rogue-directory-record", async (event, id) => {
  try {
    await runQuery("DELETE FROM rogue_directory WHERE id = ?", [id]);
    return { message: "Rogue record deleted successfully." };
  } catch (err) {
    console.error("Error deleting rogue record:", err.message);
    return { error: "Failed to delete rogue record. " + err.message };
  }
});
