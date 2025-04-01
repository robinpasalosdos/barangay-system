const { ipcMain } = require("electron");
const db = require("../db/db");

ipcMain.handle("login", async (_, { username, password }) => {
    return new Promise((resolve) => {
        db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
            if (err) {
                resolve({ success: false, message: "Database error", user: null });
            } else if (row) {
                resolve({ success: true, message: "Login successful", user: row });
            } else {
                resolve({ success: false, message: "Invalid credentials", user: null });
            }
        });
    });
});