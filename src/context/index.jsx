import React, { createContext, useState, useCallback } from "react";
import { toast } from "react-hot-toast";

const createDataContext = (fetchRecordsFn, addRecordFn, updateRecordFn, deleteRecordFn, additionalState = {}) => {
  const Context = createContext();

  const Provider = ({ children }) => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [error, setError] = useState(null);

    // States for filtering and sorting
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("newest");
    const [searchBy, setSearchBy] = useState("last_name");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [loading, setLoading] = useState(false)

    // Additional states
    const stateValues = Object.keys(additionalState).reduce((acc, key) => {
      acc[key] = useState(additionalState[key]);
      return acc;
    }, {});

    const fetchRecords = useCallback(async () => {
      setLoading(true);
      try {
        const records = await fetchRecordsFn({
          searchQuery,
          searchBy,
          startDate,
          endDate,
          sortOption,
        });
        setData(records);
      } catch (error) {
        console.error("Error fetching records:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }, [searchQuery, searchBy, startDate, endDate, sortOption]);

    const addOrUpdateRecord = async (record) => {
      try {
        let result;
        if (isEditing) {
          // Update logic with proper error handling
          result = await updateRecordFn(record);
          if (result.error) {
            throw new Error(result.error);
          }
        } else {
          // Add new record
          result = await addRecordFn(record); // Remove double await
          if (result.error) {
            throw new Error(result.error);
          }
        }
        await fetchRecords(); // Refresh data after adding or updating
        setIsModalOpen(false); // Close modal after success
        setIsEditing(false); // Reset editing state
        setSelectedData(null); // Clear selected data
      } catch (error) {
        console.error("Error adding/updating record:", error);
        toast.error(error.message);
        setError(error.message);
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

    return (
      <Context.Provider
        value={{
          data,
          loading,
          setData,
          isModalOpen,
          setIsModalOpen,
          isEditing,
          setIsEditing,
          selectedData,
          setSelectedData,
          searchQuery,
          setSearchQuery,
          sortOption,
          setSortOption,
          searchBy,
          setSearchBy,
          startDate,
          setStartDate,
          endDate,
          setEndDate,
          fetchRecords,
          addOrUpdateRecord,
          deleteRecord,
          error,
          ...Object.fromEntries(
            Object.entries(stateValues).map(([key, [value, setter]]) => [key, value])
          ),
          ...Object.fromEntries(
            Object.entries(stateValues).map(([key, [value, setter]]) => [
              `set${key.charAt(0).toUpperCase() + key.slice(1)}`,
              setter,
            ])
          ),
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
