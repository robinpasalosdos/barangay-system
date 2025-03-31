import React, { createContext, useState, useEffect } from "react";

export const PoliceClearanceContext = createContext();

export const PoliceClearanceProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isFaceCaptureVisible, setFaceCaptureVisible] = useState(false); // Add this state
  const [savedImagePath, setSavedImagePath] = useState(null);
  const [image, setImage] = useState(null);
  const [isFaceChanged, setIsFaceChanged] = useState(false); 
  // Fetch all records
  const fetchPoliceClearanceRecords = async () => {
    try {
      const records = await window.api.fetchPoliceClearanceRecords();
      setData(records);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  // Add or update a record
  const addOrUpdateRecord = async (record) => {
    try {
      if (!record.faceFileName) {
        record.faceFileName = "placeholder.jpg";
      }
      if (isEditing) {
        // Update logic
        await window.api.updatePoliceClearanceRecord(record); // Call the IPC method for updating
      } else {
        // Add new record
        await window.api.addPoliceClearanceRecord(record); // Call the IPC method for adding
      }
      fetchPoliceClearanceRecords(); // Refresh data after adding or updating
      setIsEditing(false); // Reset editing state
      setSelectedData(null); // Clear selected data
    } catch (error) {
      console.error("Error adding/updating record:", error);
    }
  };

  // Delete a record
  const deleteRecord = async (id) => {
    try {
      await window.api.deletePoliceClearanceRecord(id);
      fetchPoliceClearanceRecords(); // Refresh data
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  useEffect(() => {
    fetchPoliceClearanceRecords(); // Fetch records on component mount
  }, []);

  return (
    <PoliceClearanceContext.Provider
      value={{
        data,
        setData,
        isModalOpen,
        setIsModalOpen,
        isEditing,
        setIsEditing,
        selectedData,
        setSelectedData,
        isFaceCaptureVisible,
        setFaceCaptureVisible,
        addOrUpdateRecord,
        deleteRecord,
        savedImagePath,
        setSavedImagePath,
        image,
        setImage,
        isFaceChanged,
        setIsFaceChanged
      }}
    >
      {children}
    </PoliceClearanceContext.Provider>
  );
};