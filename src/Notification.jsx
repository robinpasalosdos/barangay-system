import React from "react";
import { Toaster, toast } from "react-hot-toast";

const NotificationProvider = () => {
  return (
    <Toaster
      position="bottom-center" // Bottom-center positioning
      reverseOrder={false} // Notifications appear in order
      gutter={8} // Space between notifications
      toastOptions={{
        duration: 5000, // Auto-dismiss after 5 seconds
        style: {
          padding: "16px",
          borderRadius: "8px",
          fontSize: "14px",
        },
        success: {
          style: { background: "#4caf50", color: "#fff" },
        },
        error: {
          style: { background: "#f44336", color: "#fff" },
        },
        warning: {
          style: { background: "#ff9800", color: "#fff" },
        },
        info: {
          style: { background: "#2196f3", color: "#fff" },
        },
      }}
    />
  );
};

export default NotificationProvider;