import React, { createContext, useState, useEffect } from "react";

const createDataContext = (fetchRecordsFn, addRecordFn, updateRecordFn, deleteRecordFn, additionalState = {}) => {
  const Context = createContext();

  const Provider = ({ children }) => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [error, setError] = useState(null);

    // Additional states
    const stateValues = Object.keys(additionalState).reduce((acc, key) => {
      acc[key] = useState(additionalState[key]);
      return acc;
    }, {});

    const fetchRecords = async () => {
      try {
        const records = await fetchRecordsFn();
        setData(records);
      } catch (error) {
        console.error("Error fetching records:", error);
        setError(error);
      }
    };
    const addOrUpdateRecord = async (record) => {
      try {
        if (isEditing) {
          // Update logic
          await updateRecordFn(record); // Call the IPC method for updating
        } else {
          // Add new record
          await await addRecordFn(record); // Call the IPC method for adding
        }
        fetchRecords(); // Refresh data after adding or updating
        setIsEditing(false); // Reset editing state
        setSelectedData(null); // Clear selected data
      } catch (error) {
        console.error("Error adding/updating record:", error);
        setError(error);
      }
    };

    const deleteRecord = async (id) => {
      try {
        await deleteRecordFn(id);
        fetchRecords(); // Refresh data
      } catch (error) {
        console.error("Error deleting record:", error);
        setError(error);
      }
    };

    useEffect(() => {
      fetchRecords();
    }, []);

    return (
      <Context.Provider
        value={{
          data,
          setData,
          isModalOpen,
          setIsModalOpen,
          isEditing,
          setIsEditing,
          selectedData,
          setSelectedData,
          addOrUpdateRecord,
          deleteRecord,
          error,
          ...Object.fromEntries(Object.entries(stateValues).map(([key, [value, setter]]) => [key, value])), // ✅ Fixes the getter issue
        ...Object.fromEntries(
          Object.entries(stateValues).map(([key, [value, setter]]) => [`set${key.charAt(0).toUpperCase() + key.slice(1)}`, setter])
        )
      }}
      >
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
};

// Police Clearance Context
export const {
  Context: PoliceClearanceContext,
  Provider: PoliceClearanceProvider,
} = createDataContext(
  window.api.fetchPoliceClearanceRecords,
  window.api.addPoliceClearanceRecord,
  window.api.updatePoliceClearanceRecord,
  window.api.deletePoliceClearanceRecord,
  {
    isFaceCaptureVisible: false,
    savedImagePath: null,
    image: null,
    isFaceChanged: false,
    fingerprints: {},
    isLeftFingerprintVisible: false,
    isRightFingerprintVisible: false
  }
);

// User Status Context
export const {
  Context: UserStatusContext,
  Provider: UserStatusProvider,
} = createDataContext(
  window.api.fetchUsers,
  window.api.addUser,
  window.api.updateUser,
  window.api.deleteUser
);

export const {
  Context: WarrantBookingContext,
  Provider: WarrantBookingProvider,
} = createDataContext(
  window.api.fetchWarrantBookingRecords,
  window.api.addWarrantBookingRecord,
  window.api.updateWarrantBookingRecord,
  window.api.deleteWarrantBookingRecord,
  {
    isFaceCaptureVisible: false,
    savedImagePath: null,
    image: {},
    isFaceChanged: false,
    activeStep: 0,
    isCaptured: false,
    isFingerprintCaptureVisible: false,
    fingerprints: {}
  }
);

export const {
  Context: RogueDirectoryContext,
  Provider: RogueDirectoryProvider,
} = createDataContext(
  window.api.fetchRogueDirectoryRecords,
  window.api.addRogueDirectoryRecord,
  window.api.updateRogueDirectoryRecord,
  window.api.deleteRogueDirectoryRecord,
  {
    isFaceCaptureVisible: false,
    savedImagePath: null,
    image: null,
    isFaceChanged: false,
  }
);
