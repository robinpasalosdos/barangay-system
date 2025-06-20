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

// Add Resident Record Handler
ipcMain.handle("add-resident-record", async (event, record) => {
  try {
    // Remove any image/fingerprint/age related fields from the main record
    const { faceFileName, fingerprints, ...cleanRecord } = record;

    // 1. Sign up in Supabase Auth first
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanRecord.email,
      password: cleanRecord.email + Date.now(), // Use a default password (can be random)
    });
    if (authError) {
      // Return the actual auth error to the frontend and stop further processing
      return { error: `Auth error: ${authError.message}` };
    }
    const user_id = authData.user.id;

    // Split record for profiles and personal_identity
    const profilesFields = [
      "firstName", "middleName", "lastName", "dateOfBirth", "email", "address", "phoneNumber", "sex", "isBarangayVerified"
    ];
    const personalIdentityFields = [
      "country", "region", "province", "city", "barangay", "street", "blockNumber", "zipCode", "citizenship", "civilStatus", "eyeColor", "hairColor", "height", "weight", "complexion", "identifyingMarks"
    ];
    const profilesData = { user_id };
    const personalIdentityData = { user_id };
    for (const key of Object.keys(cleanRecord)) {
      if (profilesFields.includes(key)) profilesData[key] = cleanRecord[key];
      if (personalIdentityFields.includes(key)) personalIdentityData[key] = cleanRecord[key];
    }

    // 2. Insert into profiles table
    const snakeCaseProfiles = toSnakeCase(profilesData);
    const { data: profileData, error: profileError } = await supabase.from("profiles").insert([snakeCaseProfiles]).select();
    if (profileError) throw new Error(`Database error (profiles): ${profileError.message}`);

    // 3. Insert into personal_identity table
    const snakeCaseIdentity = toSnakeCase(personalIdentityData);
    const { error: identityError } = await supabase.from("personal_identity").insert([snakeCaseIdentity]);
    if (identityError) throw new Error(`Database error (personal_identity): ${identityError.message}`);

    // Always return userId in camelCase for frontend compatibility
    return { message: "Resident record added successfully.", data: [{ ...profileData[0], userId: user_id }] };
  } catch (err) {
    console.error("Error adding resident record:", err.message);
    return { error: "Failed to add resident record. " + err.message };
  }
});

// Update Resident Record Handler
ipcMain.handle("update-resident-record", async (event, record) => {
  try {
    // Remove any image/fingerprint related fields from the main record
    const { faceFileName, fingerprints, ...cleanRecord } = record;
    // Use userId (camelCase) from frontend for the update
    const userId = record.userId || record.user_id;
    if (!userId) throw new Error("Missing userId for update");

    // Split record for profiles and personal_identity
    const profilesFields = [
      "firstName", "middleName", "lastName", "dateOfBirth", "email", "address", "phoneNumber", "sex", "isBarangayVerified"
    ];
    const personalIdentityFields = [
      "country", "region", "province", "city", "barangay", "street", "blockNumber", "zipCode", "citizenship", "civilStatus", "eyeColor", "hairColor", "height", "weight", "complexion", "identifyingMarks"
    ];
    const profilesData = {};
    const personalIdentityData = {};
    for (const key of Object.keys(cleanRecord)) {
      if (profilesFields.includes(key)) profilesData[key] = cleanRecord[key];
      if (personalIdentityFields.includes(key)) personalIdentityData[key] = cleanRecord[key];
    }

    // Update profiles table
    const snakeCaseProfiles = toSnakeCase(profilesData);
    const { error: profileError } = await supabase
      .from("profiles")
      .update(snakeCaseProfiles)
      .eq("user_id", userId);
    if (profileError) throw new Error(`Supabase update error (profiles): ${profileError.message}`);

    // Update personal_identity table
    const snakeCaseIdentity = toSnakeCase(personalIdentityData);
    const { error: identityError } = await supabase
      .from("personal_identity")
      .update(snakeCaseIdentity)
      .eq("user_id", userId);
    if (identityError) throw new Error(`Supabase update error (personal_identity): ${identityError.message}`);

    return { message: "Resident record updated successfully." };
  } catch (err) {
    console.error("Error updating resident record:", err.message);
    return { error: "Failed to update resident record. " + err.message };
  }
});

// Fetch Resident Records Handler
ipcMain.handle("fetch-resident-records", async (event, filters = {}) => {
  const {
    searchQuery = "",
    searchBy = "last_name",
    startDate = "",
    endDate = "",
    sortOption = "newest",
  } = filters;

  try {
    let query = supabase.from("profiles").select("*");

    if (searchQuery && searchBy) query = query.ilike(searchBy, `%${searchQuery}%`);
    if (startDate) query = query.gte("created_at", startDate);
    if (endDate) query = query.lte("created_at", endDate);

    query = query.order("created_at", { ascending: sortOption === "oldest" }).limit(50);

    const { data: rows, error } = await query;
    if (error) throw error;

    return toCamelCase(rows);
  } catch (err) {
    console.error("Error fetching resident records:", err.message);
    return { error: "Failed to fetch resident records. " + err.message };
  }
});

// Delete Resident Record Handler
ipcMain.handle("delete-resident-record", async (event, user_id) => {
  try {
    // Start a transaction to delete related records
    const { error: residentError } = await supabase
      .from("profiles")
      .delete()
      .eq("user_id", user_id);

    if (residentError) throw new Error(`Error deleting resident: ${residentError.message}`);

    // Delete from resident_images
    const { error: imageError } = await supabase
      .from("resident_images")
      .delete()
      .eq("user_id", user_id);

    if (imageError) throw new Error(`Error deleting resident images: ${imageError.message}`);

    // Delete from resident_fingerprints
    const { error: fingerprintError } = await supabase
      .from("resident_fingerprints")
      .delete()
      .eq("user_id", user_id);

    if (fingerprintError) throw new Error(`Error deleting resident fingerprints: ${fingerprintError.message}`);

    // Delete files from storage bucket
    try {
      // Delete profile image
      await supabase.storage
        .from("resident")
        .remove([`${user_id}/profile.jpg`]);

      // Delete all fingerprint images
      const fingerTypes = [
        'left-thumb', 'left-index', 'left-middle', 'left-ring', 'left-pinky',
        'right-thumb', 'right-index', 'right-middle', 'right-ring', 'right-pinky'
      ];
      
      const fingerprintPaths = fingerTypes.map(type => `${user_id}/${type}.png`);
      await supabase.storage
        .from("resident")
        .remove(fingerprintPaths);
    } catch (storageError) {
      console.warn("Warning: Some files could not be deleted from storage:", storageError);
      // Continue even if storage deletion fails
    }

    return { message: "Resident record and associated files deleted successfully." };
  } catch (err) {
    console.error("Error deleting resident record:", err.message);
    return { error: "Failed to delete resident record. " + err.message };
  }
});

// Save Resident Image Handler
ipcMain.handle("save-resident-image", async (event, imageData, userId) => {
  try {
    if (!imageData.startsWith("data:image/")) throw new Error("Invalid image data");
    if (!userId) throw new Error("Missing userId");

    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const fileName = `${userId}/profile.jpg`;

    // Upload to Supabase Storage (bucket: resident)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("resident")
      .upload(fileName, buffer, { contentType: "image/jpeg", upsert: true });

    if (uploadError) throw new Error(`Supabase upload error: ${uploadError.message}`);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("resident")
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) throw new Error("Failed to get public URL");

    // Upsert into resident_images table
    const { error: dbError } = await supabase
      .from("resident_images")
      .upsert({ user_id: userId, image_path: fileName }, { onConflict: ["user_id"] });

    if (dbError) throw new Error(`Database upsert error: ${dbError.message}`);

    return { publicUrl: publicUrlData.publicUrl, filePath: fileName };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Upload failed: " + error.message };
  }
});

// Save Fingerprint Image Handler
ipcMain.handle("save-fingerprint-image", async (event, imageData, fingerType, userId) => {
  try {
    if (!imageData.startsWith("data:image/")) throw new Error("Invalid image data");
    if (!userId) throw new Error("Missing userId");
    if (!fingerType) throw new Error("Missing fingerType");

    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const fileName = `${userId}/${fingerType}.png`;

    // First, try to delete existing file if it exists
    try {
      const { error: deleteError } = await supabase.storage
        .from("resident")
        .remove([fileName]);
      
      if (deleteError) {
        console.log(`Error deleting existing file for ${fileName}:`, deleteError);
      }
    } catch (deleteError) {
      console.log(`No existing file to delete for ${fileName}`);
    }

    // Upload to Supabase Storage (bucket: resident)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("resident")
      .upload(fileName, buffer, { 
        contentType: "image/png", 
        upsert: true,
        cacheControl: "3600"
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      // Check if it's an authentication error
      if (uploadError.message.includes("JWT") || uploadError.message.includes("auth")) {
        throw new Error("Authentication error. Please check your Supabase configuration.");
      }
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    if (!uploadData) {
      throw new Error("Upload failed: No data returned");
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("resident")
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      // If we can't get the public URL, try to delete the uploaded file
      try {
        await supabase.storage
          .from("resident")
          .remove([fileName]);
      } catch (cleanupError) {
        console.error("Failed to cleanup storage after URL error:", cleanupError);
      }
      throw new Error("Failed to get public URL for uploaded file");
    }

    // Upsert into resident_fingerprints table
    const { error: dbError } = await supabase
      .from("resident_fingerprints")
      .upsert({ 
        user_id: userId, 
        finger_type: fingerType, 
        fingerprint_path: fileName 
      }, { 
        onConflict: ["user_id", "finger_type"] 
      });

    if (dbError) {
      // If database update fails, try to delete the uploaded file
      try {
        await supabase.storage
          .from("resident")
          .remove([fileName]);
      } catch (cleanupError) {
        console.error("Failed to cleanup storage after DB error:", cleanupError);
      }
      throw new Error(`Database update failed: ${dbError.message}`);
    }

    return { 
      success: true,
      publicUrl: publicUrlData.publicUrl, 
      filePath: fileName 
    };
  } catch (error) {
    console.error("Fingerprint save error:", error);
    // Check if it's a storage-related error
    if (error.message.includes("storage") || error.message.includes("bucket")) {
      return { 
        success: false,
        error: "Storage error. Please check your Supabase storage configuration."
      };
    }
    return { 
      success: false,
      error: error.message || "Failed to save fingerprint" 
    };
  }
});

// Fetch Resident Biometrics Handler
ipcMain.handle("fetch-resident-biometrics", async (event, userId) => {
  try {
    // Get profile image
    const { data: imageRows, error: imageError } = await supabase
      .from("resident_images")
      .select("image_path")
      .eq("user_id", userId)
      .single();

    // Get fingerprints
    const { data: fingerprintRows, error: fpError } = await supabase
      .from("resident_fingerprints")
      .select("finger_type, fingerprint_path")
      .eq("user_id", userId);

    if (imageError || fpError) throw new Error(imageError?.message || fpError?.message);

    return {
      image_path: imageRows?.image_path || null,
      fingerprints: fingerprintRows || [],
    };
  } catch (err) {
    return { error: err.message };
  }
});