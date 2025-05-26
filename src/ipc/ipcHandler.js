import { ipcMain } from "electron";
import { supabase } from "../lib/supabase.js";
import { promisify } from "util";
import { fileURLToPath } from "url";
import path from "path";
import db from "../db/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allQuery = promisify(db.all.bind(db));
const runQuery = promisify(db.run.bind(db));

// Utility functions for case conversion
const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    acc[snakeKey] = toSnakeCase(obj[key]);
    return acc;
  }, {});
};

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
};

// Add Record Handler
ipcMain.handle("add-police-clearance-record", async (event, record) => {
  try {
    const snakeCaseRecord = toSnakeCase(record);
    const { data, error } = await supabase.from("barangay_clearance").insert([snakeCaseRecord]);

    if (error) throw new Error(`Database error: ${error.message}`);
    return { message: "Record added successfully.", data };
  } catch (err) {
    console.error("Error adding record:", err.message);
    return { error: "Failed to add record. " + err.message };
  }
});

// Update Record Handler
ipcMain.handle("update-police-clearance-record", async (event, record) => {
  try {
    const snakeCaseRecord = toSnakeCase(record);
    const { error } = await supabase
      .from("barangay_clearance")
      .update(snakeCaseRecord)
      .eq("id", record.id);

    if (error) throw new Error(`Supabase update error: ${error.message}`);
    return { message: "Record updated successfully." };
  } catch (err) {
    console.error("Error updating record:", err.message);
    return { error: "Failed to update record. " + err.message };
  }
});

// Fetch Records Handler
ipcMain.handle("fetch-police-clearance-records", async (event, filters = {}) => {
  const {
    searchQuery = "",
    searchBy = "last_name",
    startDate = "",
    endDate = "",
    sortOption = "newest",
  } = filters;

  try {
    let query = supabase.from("barangay_clearance").select("*");

    if (searchQuery && searchBy) query = query.ilike(searchBy, `%${searchQuery}%`);
    if (startDate) query = query.gte("created_timestamp", startDate);
    if (endDate) query = query.lte("created_timestamp", endDate);

    query = query.order("created_timestamp", { ascending: sortOption === "oldest" }).limit(50);

    const { data: rows, error } = await query;
    if (error) throw error;

    return toCamelCase(rows);
  } catch (err) {
    console.error("Error fetching records:", err.message);
    return { error: "Failed to fetch records. " + err.message };
  }
});

// Delete Record Handler
ipcMain.handle("delete-police-clearance-record", async (event, id) => {
  try {
    const { error } = await supabase
      .from("barangay_clearance")
      .delete()
      .eq("id", id);

    if (error) throw new Error(`Supabase delete error: ${error.message}`);
    return { message: "Record deleted successfully." };
  } catch (err) {
    console.error("Error deleting record:", err.message);
    return { error: "Failed to delete record. " + err.message };
  }
});

// Save Image Handler
ipcMain.handle("save-police-clearance-image", async (event, imageData) => {
  try {
    if (!imageData.startsWith("data:image/")) throw new Error("Invalid image data");

    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const fileName = `public/image-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;

    const { data, error } = await supabase.storage
      .from("barangay-clearance-images")
      .upload(fileName, buffer, { contentType: "image/jpeg", upsert: true });

    if (error) throw new Error(`Supabase upload error: ${error.message}`);

    const { data: publicUrlData } = supabase.storage
      .from("barangay-clearance-images")
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) throw new Error("Failed to get public URL");

    return { publicUrl: publicUrlData.publicUrl };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Upload failed: " + error.message };
  }
});
