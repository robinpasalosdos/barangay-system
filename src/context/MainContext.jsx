import React, { createContext, useState } from "react";
import { UserStatusProvider, PoliceClearanceProvider, WarrantBookingProvider } from "./";

// Create a MainContext for shared global state
export const MainContext = createContext();

export const MainProvider = ({ children }) => {
  // Shared global state
  const [globalState, setGlobalState] = useState({
    appTitle: "Barangay System",
    user: null, // Shared user information
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <MainContext.Provider
      value={{
        globalState,
        setGlobalState,
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser
      }}
    >
      {/* Wrap feature-specific providers */}
      <UserStatusProvider>
        <PoliceClearanceProvider>
          <WarrantBookingProvider>
            {children}
          </WarrantBookingProvider>
        </PoliceClearanceProvider>
      </UserStatusProvider>
    </MainContext.Provider>
  );
};