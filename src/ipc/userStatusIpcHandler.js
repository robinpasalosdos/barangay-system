import { ipcMain } from "electron";
import { supabase } from "../lib/supabase.js";
// import fs from "fs"; never read but maybe in the future
// import path from "path"; ^^

const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    acc[snakeKey] = toSnakeCase(obj[key]);
    return acc;
  }, {});
};

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
};

// Add User Handler
ipcMain.handle("add-user", async (event, record) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: record.email,
      password: record.password,
    });

    if (authError) {
      throw new Error(`Auth error: ${authError.message}`);
    }

    const user_id = authData.user.id;

    const { id, password, confirmPassword, ...restOfRecord } = record;
    const snakeCaseRecord = toSnakeCase({
      ...restOfRecord,
      userId: user_id,
    });

    const { data, error } = await supabase.from("users").insert([snakeCaseRecord]);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return { message: "User added successfully." };
  } catch (err) {
    console.error("Error adding user:", err);
    return { error: "Failed to add user. " + err.message };
  }
});

// Update User Handler
ipcMain.handle("update-user", async (event, record) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        police_clearance: record.policeClearance,
        citizen_information: record.citizenInformation,
        warrant_booking: record.warrantBooking,
        rogue_directory: record.rogueDirectory,
        user_status: record.userStatus,
        add_user_action: record.addUserAction,
        delete_user_action: record.deleteUserAction,
        print_user_action: record.printUserAction,
        edit_user_action: record.editUserAction,
        search_user_action: record.searchUserAction
      })
      .eq("id", record.id);

    if (error) throw error;

    return { message: "User updated successfully." };
  } catch (err) {
    console.error("Error updating user:", err);
    return { error: "Failed to update user. " + err.message };
  }
});



ipcMain.handle("fetch-users", async (event, filters = {}) => {
  const {
    searchQuery = "",
    searchBy = "email",
    startDate = "",
    endDate = "",
    sortOption = "newest",
  } = filters;

  try {
    let query = supabase.from("user_with_email_confirmed").select("*");

    if (searchQuery && searchBy) {
      query = query.ilike(searchBy, `%${searchQuery}%`);
    }

    if (startDate) {
      query = query.gte("created_timestamp", startDate);
    }
    if (endDate) {
      query = query.lte("created_timestamp", endDate);
    }

    if (sortOption === "newest") {
      query = query.order("created_timestamp", { ascending: false });
    } else if (sortOption === "oldest") {
      query = query.order("created_timestamp", { ascending: true });
    } else if (sortOption === "username") {
      query = query.order("username", { ascending: true });
    } else if (sortOption === "email") {
      query = query.order("email", { ascending: true });
    }

    query = query.limit(50);

    const { data: rows, error } = await query;

    if (error) throw error;

    return toCamelCase(rows);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    return { error: "Failed to fetch users. " + err.message };
  }
});

// Delete User Handler
ipcMain.handle("delete-user", async (event, id) => {
  try {
    // 1. Get Auth user ID from your 'users' table
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !userData) {
      throw new Error(`Failed to fetch user: ${fetchError?.message || "User not found"}`);
    }

    const userId = userData.user_id;

    // 2. Try deleting from Supabase Auth first
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      throw new Error(`Failed to delete user from Supabase Auth: ${authError.message}`);
    }

    // 3. If Auth deletion succeeded, delete from 'users' table
    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw new Error(`Auth user deleted, but failed to delete user from database: ${deleteError.message}`);
    }

    return { message: "User deleted from both Auth and database successfully." };
  } catch (err) {
    console.error("Error deleting user:", err.message);
    return { error: "Failed to delete user. " + err.message };
  }
});

