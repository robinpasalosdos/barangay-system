import { ipcMain } from "electron";
import { supabase } from "../lib/supabase.js";

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
ipcMain.handle("add-rogue-directory-record", async (event, record) => {
  try {
    const snakeCaseRecord = toSnakeCase(record); // Convert record keys to snake_case
    const { data, error } = await supabase.from("rogue_directory").insert([snakeCaseRecord]);

    if (error) throw new Error(`Supabase insert error: ${error.message}`);
    return { message: "Rogue record added successfully.", data };
  } catch (err) {
    console.error("Error adding rogue record:", err.message);
    return { error: "Failed to add rogue record. " + err.message };
  }
});

// Update Record Handler
ipcMain.handle("update-rogue-directory-record", async (event, record) => {
  try {
    const snakeCaseRecord = toSnakeCase(record); // Convert record keys to snake_case
    const { error } = await supabase
      .from("rogue_directory")
      .update(snakeCaseRecord)
      .eq("id", record.id); // Match the record by ID

    if (error) throw new Error(`Supabase update error: ${error.message}`);
    return { message: "Rogue record updated successfully." };
  } catch (err) {
    console.error("Error updating rogue record:", err.message);
    return { error: "Failed to update rogue record. " + err.message };
  }
});

// Fetch Records Handler
ipcMain.handle("fetch-rogue-directory-records", async (event, filters = {}) => {
  const {
    searchQuery = "",
    searchBy = "last_name",
    startDate = "",
    endDate = "",
    sortOption = "newest",
  } = filters;

  try {
    let query = supabase.from("rogue_directory").select("*");

    if (searchQuery && searchBy) query = query.ilike(searchBy, `%${searchQuery}%`);
    if (startDate) query = query.gte("commited_date", startDate);
    if (endDate) query = query.lte("commited_date", endDate);

    query = query.order("commited_date", { ascending: sortOption === "oldest" }).limit(50);

    const { data: rows, error } = await query;
    if (error) throw error;

    return toCamelCase(rows); // Convert keys to camelCase before returning
  } catch (err) {
    console.error("Error fetching rogue records:", err.message);
    return { error: "Failed to fetch rogue records. " + err.message };
  }
});

// Delete Record Handler
ipcMain.handle("delete-rogue-directory-record", async (event, id) => {
  try {
    const { error } = await supabase
      .from("rogue_directory")
      .delete()
      .eq("id", id); // Match the record by ID

    if (error) throw new Error(`Supabase delete error: ${error.message}`);
    return { message: "Rogue record deleted successfully." };
  } catch (err) {
    console.error("Error deleting rogue record:", err.message);
    return { error: "Failed to delete rogue record. " + err.message };
  }
});
