import React, { createContext, useState, useEffect } from "react";
import { UserStatusProvider, PoliceClearanceProvider, WarrantBookingProvider, RogueDirectoryProvider } from "./";
import { supabase } from "../lib/supabase.js";
// Create a MainContext for shared global state
export const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

useEffect(() => {
    const checkSession = async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Error fetching session:", error.message);
                return;
            }
            if (session) {
                const { data: userData, error: userDataError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("user_id", session.user.id)
                    .single();

                if (userDataError) {
                    console.error("Error fetching user profile:", userDataError.message);
                    setisLoggedIn(false);
                    setUser(null);
                    return;
                }

                const fullUser = { ...session.user, ...userData };
                setisLoggedIn(true);
                setUser(fullUser);
            } else {
                setisLoggedIn(false);
                setUser(null);
            }
        } catch (err) {
            console.error("Unexpected error during session check:", err.message);
        }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
            const { data: userData, error: userDataError } = await supabase
                .from("users")
                .select("*")
                .eq("user_id", session.user.id)
                .single();

            if (userDataError) {
                console.error("Error fetching user profile:", userDataError.message);
                setisLoggedIn(false);
                setUser(null);
                return;
            }

            const fullUser = { ...session.user, ...userData };
            setisLoggedIn(true);
            setUser(fullUser);
        } else {
            setisLoggedIn(false);
            setUser(null);
        }
    });

    return () => {
        authListener?.subscription?.unsubscribe();
    };
}, []);

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setisLoggedIn,
        user,
        setUser
      }}
    >
      {/* Wrap feature-specific providers */}
      <UserStatusProvider>
        <PoliceClearanceProvider>
          <WarrantBookingProvider>
            <RogueDirectoryProvider>
            {children}
            </RogueDirectoryProvider>
          </WarrantBookingProvider>
        </PoliceClearanceProvider>
      </UserStatusProvider>
    </MainContext.Provider>
  );
};