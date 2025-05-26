import { ipcMain } from "electron";
import { supabase } from "../lib/supabase.js";

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
ipcMain.handle("add-warrant-booking-record", async (event, record) => {
  try {
    const snakeCaseRecord = toSnakeCase(record); // Convert record keys to snake_case
    const { data, error } = await supabase.from("warrant_booking").insert([snakeCaseRecord]);

    if (error) throw new Error(`Supabase insert error: ${error.message}`);
    return { message: "Record added successfully.", data };
  } catch (err) {
    console.error("Error adding record:", err.message);
    return { error: "Failed to add record. " + err.message };
  }
});

// Update Record Handler
ipcMain.handle("update-warrant-booking-record", async (event, record) => {
  try {
    const snakeCaseRecord = toSnakeCase(record); // Convert record keys to snake_case
    const { error } = await supabase
      .from("warrant_booking")
      .update(snakeCaseRecord)
      .eq("id", record.id); // Match the record by ID

    if (error) throw new Error(`Supabase update error: ${error.message}`);
    return { message: "Record updated successfully." };
  } catch (err) {
    console.error("Error updating record:", err.message);
    return { error: "Failed to update record. " + err.message };
  }
});

// Fetch Records Handler
ipcMain.handle("fetch-warrant-booking-records", async (event, filters = {}) => {
  const {
    searchQuery = "",
    searchBy = "last_name",
    startDate = "",
    endDate = "",
    sortOption = "newest",
  } = filters;

  try {
    let query = supabase.from("warrant_booking").select("*");

    if (searchQuery && searchBy) query = query.ilike(searchBy, `%${searchQuery}%`);
    if (startDate) query = query.gte("committed_date", startDate);
    if (endDate) query = query.lte("committed_date", endDate);

    query = query.order("committed_date", { ascending: sortOption === "oldest" }).limit(50);

    const { data: rows, error } = await query;
    if (error) throw error;

    return toCamelCase(rows); // Convert keys to camelCase before returning
  } catch (err) {
    console.error("Error fetching records:", err.message);
    return { error: "Failed to fetch records. " + err.message };
  }
});

// Delete Record Handler
ipcMain.handle("delete-warrant-booking-record", async (event, id) => {
  try {
    const { error } = await supabase
      .from("warrant_booking")
      .delete()
      .eq("id", id); // Match the record by ID

    if (error) throw new Error(`Supabase delete error: ${error.message}`);
    return { message: "Record deleted successfully." };
  } catch (err) {
    console.error("Error deleting record:", err.message);
    return { error: "Failed to delete record. " + err.message };
  }
});
