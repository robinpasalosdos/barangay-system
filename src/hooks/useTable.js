import { useState, useEffect } from "react";

const useTable = (data, setSelectedData, setIsEditing, setIsModalOpen) => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState(data); // State for filtered data

  // Handle search functionality
  useEffect(() => {
    const filtered = data.filter((record) => {
      const fullName = `${record.lastName} ${record.firstName} ${record.middleName}`.toLowerCase();
      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        record.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.gender.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredData(filtered);
  }, [searchQuery, data]);

  // Handle managing a record (e.g., editing)
  const handleManage = (record) => {
    setSelectedData(record); // Set the selected record
    setIsEditing(true); // Enable editing mode
    setIsModalOpen(true); // Open the modal
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
    handleManage,
  };
};

export default useTable;