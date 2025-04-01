import React, { createContext, useState, useEffect } from "react";

export const UserStatusContext = createContext();

export const UserStatusProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  // Fetch all records
  const fetchUsers = async () => {
    try {
      const records = await window.api.fetchUsers();
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
        await window.api.updateUser(record); // Call the IPC method for updating
      } else {
        // Add new record
        await window.api.addUser(record); // Call the IPC method for adding
      }
      fetchUsers(); // Refresh data after adding or updating
      setIsEditing(false); // Reset editing state
      setSelectedData(null); // Clear selected data
    } catch (error) {
      console.error("Error adding/updating record:", error);
    }
  };

  // Delete a record
  const deleteRecord = async (id) => {
    try {
      await window.api.deleteUser(id);
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch records on component mount
  }, []);

  return (
    <UserStatusContext.Provider
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
    </UserStatusContext.Provider>
  );
};