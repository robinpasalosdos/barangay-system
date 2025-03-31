const { ipcMain } = require("electron");
const db = require("../db/userStatusDb");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const allQuery = promisify(db.all.bind(db));
const runQuery = promisify(db.run.bind(db));

const columns = [
    "userName",
    "password",
    "policeClearance",
    "citizenInformation",
    "warrantBooking",
    "rogueDirectory",
    "userStatus",
    "addUSerAction", 
    "deleteUSerAction",
    "printUSerAction",
    "editUSerAction",
    "searchUSerAction"
];

// Add Record Handler
ipcMain.handle("add-user", async (event, record) => {
  try {
    const placeholders = columns.map(() => "?").join(", ");
    const sql = `INSERT INTO users (${columns.join(", ")}) VALUES (${placeholders})`;
    const values = columns.map((col) => record[col]);

    await runQuery(sql, values);
    return { message: "Record added successfully." };
  } catch (err) {
    console.error("Error adding record:", err);
    return { error: "Failed to add record. " + err.message };
  }
});

// Update Record Handler
ipcMain.handle("update-user", async (event, record) => {
  try {
    const setClause = columns.map((col) => `${col} = ?`).join(", ");
    const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
    const values = [...columns.map((col) => record[col]), record.id];

    await runQuery(sql, values);
    return { message: "Record updated successfully." };
  } catch (err) {
    console.error("Error updating record:", err);
    return { error: "Failed to update record. " + err.message };
  }
});

ipcMain.handle("fetch-users", async () => {
  try {
    const rows = await allQuery("SELECT * FROM users");
    return rows;
  } catch (err) {
    console.error("Error fetching records:", err.message);
    return { error: "Failed to fetch records. " + err.message };
  }
});

// Delete Record
ipcMain.handle("delete-user", async (event, id) => {
  try {
    await runQuery("DELETE FROM users WHERE id = ?", [id]);
    return { message: "Record deleted successfully." };
  } catch (err) {
    console.error("Error deleting record:", err.message);
    return { error: "Failed to delete record. " + err.message };
  }
});