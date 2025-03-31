import React, { createContext, useState } from "react";
import { UserStatusProvider } from "./UserStatusContext";
import { PoliceClearanceProvider } from "./PoliceClearanceContext"; // Example for another feature-specific provider

// Create a MainContext for shared global state
export const MainContext = createContext();

export const MainProvider = ({ children }) => {
  // Shared global state
  const [globalState, setGlobalState] = useState({
    appTitle: "Barangay System",
    user: null, // Shared user information
  });

  return (
    <MainContext.Provider value={{ globalState, setGlobalState }}>
      {/* Wrap feature-specific providers */}
      <UserStatusProvider>
        <PoliceClearanceProvider>
          {children}
        </PoliceClearanceProvider>
      </UserStatusProvider>
    </MainContext.Provider>
  );
};