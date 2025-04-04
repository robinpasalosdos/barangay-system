import React, { useContext } from "react";
import Table from "../Shared/Table/Table";
import { PoliceClearanceContext } from "../../context";
import useTable from "../../hooks/useTable";
import PoliceClearanceFaceCapture from "./PoliceClearanceFaceCapture";
import PoliceClearanceForm from "./PoliceClearanceForm";


const PoliceClearance = () => {
  const featureName = "Police Clearance";
  const columns = [
    { key: "documentNumber", label: "Doc #" },
    { key: "documentDate", label: "Document Date" },
    { key: "pcNumber", label: "PC #", render: () => "12345" },
    { key: "orNumber", label: "OR #" },
    { key: "orDate", label: "OR Date" },
    { key: "lastName", label: "Name" },
    { key: "user", label: "User", render: () => "Robin" },
  ];
  const context = useContext(PoliceClearanceContext);
 
  const {
    data,
    setIsModalOpen,
    setIsEditing,
    setSelectedData,
    deleteRecord,
  } = context;

  const {
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredData,
    handleManage,
    generatePDF,
    
    
  } = useTable(data, setSelectedData, setIsEditing, setIsModalOpen, featureName, columns, ["documentNumber", "documentDate"]);

  return (
    <Table 
    columns = {columns}
    searchQuery = {searchQuery}
    setSearchQuery = {setSearchQuery}
    filteredData = {filteredData}
    handleManage = {handleManage}
    deleteRecord = {deleteRecord}
    setIsModalOpen = {setIsModalOpen}
    setIsEditing = {setIsEditing}
    setSelectedData = {setSelectedData}
    featureName = {featureName.toUpperCase()}
    generatePDF = {generatePDF}
    startDate = {startDate}
    setStartDate = {setStartDate}
    endDate = {endDate}
    setEndDate = {setEndDate}
    sortOption = {sortOption}
    setSortOption = {setSortOption}
    additionalComponents={() => (
      <>
        <PoliceClearanceForm />
        <PoliceClearanceFaceCapture />
      </>
    )}
    />
  );
};

export default PoliceClearance;

