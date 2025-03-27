import React, { createContext, useState, useEffect } from "react";

export const BarangayClearanceContext = createContext();

export const BarangayProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // Fetch all records
  const fetchRecords = async () => {
    try {
      const records = await window.api.fetchRecords();
      setData(records);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  // Add or update a record
  const addOrUpdateRecord = async (record) => {
    try {
      if (isEditing) {
        // Update logic
        await window.api.updateRecord(record); // Call the IPC method for updating
      } else {
        // Add new record
        await window.api.addRecord(record); // Call the IPC method for adding
      }
      fetchRecords(); // Refresh data after adding or updating
      setIsEditing(false); // Reset editing state
      setSelectedData(null); // Clear selected data
    } catch (error) {
      console.error("Error adding/updating record:", error);
    }
  };

  // Delete a record
  const deleteRecord = async (id) => {
    try {
      await window.api.deleteRecord(id);
      fetchRecords(); // Refresh data
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  useEffect(() => {
    fetchRecords(); // Fetch records on component mount
  }, []);

  return (
    <BarangayClearanceContext.Provider
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
      }}
    >
      {children}
    </BarangayClearanceContext.Provider>
  );
};