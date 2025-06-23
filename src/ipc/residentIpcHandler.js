import { ipcMain } from "electron";
import { supabase, supabaseUrl, supabaseServiceKey } from "../lib/supabase.js";
import { createClient } from '@supabase/supabase-js';
import { toSnakeCase, toCamelCase } from '../lib/caseUtils.js';

// Add Resident Record Handler
ipcMain.handle("add-resident-record", async (event, record) => {
  let user_id = null;
  try {
    // Remove any image/fingerprint/age related fields from the main record
    const { faceFileName, fingerprints, ...cleanRecord } = record;

    // 1. Sign up in Supabase Auth first
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanRecord.email,
      password: cleanRecord.email + Date.now(), // Use a default password (can be random)
    });
    if (authError) {
      // Check for duplicate email error
      if (
        authError.message &&
        (authError.message.toLowerCase().includes("already registered") ||
         authError.message.toLowerCase().includes("email") && authError.message.toLowerCase().includes("exists"))
      ) {
        return { error: "This email is already registered. Please use a different email address." };
      }
      // Return the actual auth error to the frontend and stop further processing
      return { error: `Auth error: ${authError.message}` };
    }
    if (!authData || !authData.user || !authData.user.id) {
      return { error: "Failed to create user in authentication. No user ID returned." };
    }
    user_id = authData.user.id;

    // Split record for profiles and personal_identity
    const profilesFields = [
      "firstName", "middleName", "lastName", "dateOfBirth", "email", "address", "phoneNumber", "sex"
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
    return { 
      message: "Resident record added successfully.", 
      data: [{ userId: user_id }]
    };
  } catch (err) {
    console.error("Error adding resident record:", err.message);
    // If user_id exists, delete the user from auth to prevent orphaned accounts
    if (user_id) {
      try {
        // Use the Supabase service role key for admin actions
        const admin = createClient(supabaseUrl, supabaseServiceKey);
        await admin.auth.admin.deleteUser(user_id);
      } catch (cleanupErr) {
        console.error("Failed to cleanup auth user after error:", cleanupErr.message);
      }
    }
    // If the error is about duplicate email, make it clear for the frontend
    if (
      err.message &&
      (err.message.toLowerCase().includes("already registered") ||
       err.message.toLowerCase().includes("email") && err.message.toLowerCase().includes("exists"))
    ) {
      return { error: "This email is already registered. Please use a different email address." };
    }
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
      "firstName", "middleName", "lastName", "dateOfBirth", "email", "address", "phoneNumber", "sex", "isBarangayRegistered"
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
    // 1. Fetch all profiles
    let query = supabase.from("profiles").select("*").order("created_at", { ascending: sortOption === "oldest" }).limit(50);
    if (searchQuery && searchBy) query = query.ilike(searchBy, `%${searchQuery}%`);
    if (startDate) query = query.gte("created_at", startDate);
    if (endDate) query = query.lte("created_at", endDate);
    const { data: profiles, error: profilesError } = await query;
    if (profilesError) throw profilesError;

    // 2. Fetch all personal_identity
    const { data: identities, error: identitiesError } = await supabase.from("personal_identity").select("*");
    if (identitiesError) throw identitiesError;

    // 3. Fetch all requests
    const { data: requests, error: requestsError } = await supabase.from("requests").select("*");
    if (requestsError) throw requestsError;

    // 4. Fetch all user_registered_barangay
    const { data: registered, error: registeredError } = await supabase.from("user_registered_barangay").select("user_id");
    if (registeredError) throw registeredError;
    const registeredUserIds = new Set((registered || []).map(r => r.user_id));

    // 5. Merge: for each profile, find their identity, most recent request, and barangay registration
    const result = profiles.map(profile => {
      // Find matching personal_identity
      const identity = identities.find(i => i.user_id === profile.user_id) || {};
      // Find all requests for this user
      const userRequests = requests.filter(r => r.user_id === profile.user_id);
      // Sort by date_received descending
      userRequests.sort((a, b) => new Date(b.date_received) - new Date(a.date_received));
      // Get the most recent
      const latest = userRequests[0];
      let documents_requested = [];
      if (latest && latest.requests && latest.requests.documents_requested) {
        documents_requested = latest.requests.documents_requested;
      }
      // Check barangay registration
      const isBarangayRegistered = registeredUserIds.has(profile.user_id);
      return {
        ...profile,
        ...identity,
        documents_requested,
        isBarangayRegistered,
      };
    });

    return toCamelCase(result);
  } catch (err) {
    console.error("Error fetching resident records:", err.message);
    return { error: "Failed to fetch resident records. " + err.message };
  }
});

// Delete Resident Record Handler
ipcMain.handle("delete-resident-record", async (event, user_id) => {
  try {
    // Delete user from auth.users using the admin client
    try {
      const admin = createClient(supabaseUrl, supabaseServiceKey);
      await admin.auth.admin.deleteUser(user_id);
    } catch (authErr) {
      console.error("Error deleting user from auth.users:", authErr.message);
      throw new Error("Failed to delete user from authentication: " + authErr.message);
    }

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

    return { message: "User deleted from auth.users and images/fingerprints removed from storage." };
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