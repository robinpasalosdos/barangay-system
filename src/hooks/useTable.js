import { useState, useEffect, useMemo } from "react";

const useTable = (data, setSelectedData, setIsEditing, setIsModalOpen, filterKeys = []) => {
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Memoize filtered data to optimize performance
  const filteredData = useMemo(() => {
    return data.filter((record) => {
      return filterKeys.some((key) =>
        record[key]?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, data, filterKeys]);

  // Handle managing a record (e.g., editing)
  const handleManage = (record) => {
    setSelectedData(record);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
    handleManage,
  };
};

export default useTable;
