import React, { useContext } from "react";
import Table from "../Shared/Table/Table";
import { PoliceClearanceContext } from "../../context";
import PoliceClearanceFaceCapture from "./PoliceClearanceFaceCapture";
import PoliceClearanceForm from "./PoliceClearanceForm";
import SingleHandFingerprintCapture from "./SingleHandFingerprintCapture";

const PoliceClearance = () => {
  const featureName = "Barangay Clearance";
  const columns = [
    { key: "documentNumber", label: "Doc #" },
    { key: "documentDate", label: "Document Date" },
    // { key: "pcNumber", label: "PC #", render: () => "12345" },
    { key: "orNumber", label: "OR #" },
    { key: "orDate", label: "OR Date" },
    { key: "lastName", label: "Name", render: (row) => `${row.lastName}, ${row.firstName} ${row.middleName}` },
    { key: "user", label: "User" },
  ];
  const context = useContext(PoliceClearanceContext);
  const searchOptions = [
    { value: "last_name", label: "Full Name (LN, FN MN)" },
    { value: "document_number", label: "Document Number" }
  ];
    const sortOptions = [
    { value: "newest", display: "Newest to Oldest" },
    { value: "oldest", display: "Oldest to Newest" },
  ];
  const {
    data,
    loading,
    fetchRecords,
    setIsModalOpen,
    setIsEditing,
    setSelectedData,
    deleteRecord,
    searchQuery,
    setSearchQuery,
    searchBy,
    setSearchBy,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortOption,
    setSortOption,
  } = context;

  return (
    <Table 
    columns = {columns}
    data = {data}
    loading={loading}
    deleteRecord = {deleteRecord}
    setIsModalOpen = {setIsModalOpen}
    setIsEditing = {setIsEditing}
    setSelectedData = {setSelectedData}
    featureName = {featureName}
    searchOptions = {searchOptions}
    sortOptions={sortOptions}
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}
    searchBy={searchBy}
    setSearchBy={setSearchBy}
    startDate={startDate}
    setStartDate={setStartDate}
    endDate={endDate}
    setEndDate={setEndDate}
    sortOption={sortOption}
    setSortOption={setSortOption}
    fetchRecords={fetchRecords}
    additionalComponents={() => (
      <>
        <PoliceClearanceForm />
        <PoliceClearanceFaceCapture />
        <SingleHandFingerprintCapture />
      </>
    )}
    />
  );
};

export default PoliceClearance;

