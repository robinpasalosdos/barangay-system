import { ipcMain } from "electron";
import { supabase } from "../lib/supabase.js";
import { toSnakeCase, toCamelCase } from "../lib/caseUtils.js";

// Add Record Handler
ipcMain.handle("add-police-clearance-record", async (event, record) => {
  try {
    // Insert into documents first
    const docRecord = toSnakeCase({
      user_id: record.userId || record.user_id,
      type: "barangay_clearance",
      purpose: record.purpose,
      findings: record.findings,
      remarks: record.remarks,
    });
    const { data: docData, error: docError } = await supabase.from("documents").insert([docRecord]).select();
    if (docError) throw new Error(`Database error (documents): ${docError.message}`);
    const document_number = docData[0].document_number;

    // Insert into barangay_clearance
    const clearanceRecord = toSnakeCase({
      ...record,
      document_number,
    });
    const { data: clearanceData, error: clearanceError } = await supabase.from("barangay_clearance").insert([clearanceRecord]).select();
    if (clearanceError) throw new Error(`Database error (barangay_clearance): ${clearanceError.message}`);

    return { message: "Record added successfully.", data: { ...docData[0], ...clearanceData[0] } };
  } catch (err) {
    console.error("Error adding record:", err.message);
    return { error: "Failed to add record. " + err.message };
  }
});

// Update Record Handler
ipcMain.handle("update-police-clearance-record", async (event, record) => {
  try {
    // Update documents
    const docRecord = toSnakeCase({
      purpose: record.purpose,
      findings: record.findings,
      remarks: record.remarks,
    });
    const { error: docError } = await supabase
      .from("documents")
      .update(docRecord)
      .eq("document_number", record.documentNumber || record.document_number);
    if (docError) throw new Error(`Supabase update error (documents): ${docError.message}`);

    // Update barangay_clearance
    const clearanceRecord = toSnakeCase(record);
    const { error: clearanceError } = await supabase
      .from("barangay_clearance")
      .update(clearanceRecord)
      .eq("document_number", record.documentNumber || record.document_number);
    if (clearanceError) throw new Error(`Supabase update error (barangay_clearance): ${clearanceError.message}`);

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
    // Join documents and barangay_clearance
    let query = supabase
      .from("barangay_clearance")
      .select("*, documents:documents(*)")
      .order("created_at", { ascending: sortOption === "oldest" })
      .limit(50);

    if (searchQuery && searchBy) query = query.ilike(searchBy, `%${searchQuery}%`);
    if (startDate) query = query.gte("created_at", startDate);
    if (endDate) query = query.lte("created_at", endDate);

    const { data: rows, error } = await query;
    if (error) throw error;

    // Flatten the joined data
    const result = rows.map(row => ({ ...row.documents, ...row }));
    return toCamelCase(result);
  } catch (err) {
    console.error("Error fetching records:", err.message);
    return { error: "Failed to fetch records. " + err.message };
  }
});

// Delete Record Handler
ipcMain.handle("delete-police-clearance-record", async (event, document_number) => {
  try {
    // Delete from barangay_clearance first
    const { error: clearanceError } = await supabase
      .from("barangay_clearance")
      .delete()
      .eq("document_number", document_number);
    if (clearanceError) throw new Error(`Supabase delete error (barangay_clearance): ${clearanceError.message}`);

    // Then delete from documents
    const { error: docError } = await supabase
      .from("documents")
      .delete()
      .eq("document_number", document_number);
    if (docError) throw new Error(`Supabase delete error (documents): ${docError.message}`);

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
