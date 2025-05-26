import { ipcMain } from "electron";
import { supabase } from "../lib/supabase.js";

// Convert snake_case user permission fields to camelCase
function mapUserFields(userData) {
    return {
        ...userData,
        policeClearance: !!userData.police_clearance,
        citizenInformation: !!userData.citizen_information,
        warrantBooking: !!userData.warrant_booking,
        rogueDirectory: !!userData.rogue_directory,
        userStatus: !!userData.user_status,
        addUserAction: !!userData.add_user_action,
        deleteUserAction: !!userData.delete_user_action,
        printUserAction: !!userData.print_user_action,
        editUserAction: !!userData.edit_user_action,
        searchUserAction: !!userData.search_user_action,
    };
}

ipcMain.handle("login", async (_, { email, password }) => {
    try {
        // Check if a user with this email exists
        const { data: existingUserData, error: existingUserError } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (existingUserError) {
            console.warn("User not found for email:", email);
            // Don't reveal too much — return generic message
            return { success: false, message: "Invalid email or password", user: null };
        }

        // Attempt to sign in
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            // If user exists but auth fails, maybe it's unverified
            if (!authData?.user?.email_confirmed_at) {
                console.warn("Unverified email login attempt:", email);
                return {
                    success: false,
                    message: "Email not verified. Please verify your email before logging in.",
                    user: null,
                };
            }

            return { success: false, message: "Invalid email or password", user: null };
        }

        const user = authData.user;

        // Confirm email verification again just in case
        if (!user.email_confirmed_at) {
            console.warn("Login attempt with unverified email:", email);
            return {
                success: false,
                message: "Email not verified. Please verify your email before logging in.",
                user: null,
            };
        }

        const user_id = user.id;

        // Fetch user profile
        const { data: userData, error: userDataError } = await supabase
            .from("users")
            .select("*")
            .eq("user_id", user_id)
            .single();

        if (userDataError || !userData) {
            console.error("User profile fetch error:", userDataError?.message || "Profile not found");
            return {
                success: false,
                message: userDataError?.message || "User profile not found",
                user: null,
            };
        }

        const mappedUser = mapUserFields(userData);

        return {
            success: true,
            message: "Login successful",
            user: { ...user, ...mappedUser },
        };
    } catch (error) {
        console.error("Unexpected login error:", error.message);
        return {
            success: false,
            message: "An unexpected error occurred during login",
            user: null,
        };
    }
});


ipcMain.handle("logout", async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        return { success: false, message: error.message };
    }

    return { success: true };
});
