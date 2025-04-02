import React, { useContext } from "react";
import Table from "../Shared/Table/Table";
import { PoliceClearanceContext } from "../../context";
import useTable from "../../hooks/useTable";
import PoliceClearanceFaceCapture from "./PoliceClearanceFaceCapture";
import PoliceClearanceForm from "./PoliceClearanceForm";


const PoliceClearance = () => {
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
    filteredData,
    handleManage,
  } = useTable(data, setSelectedData, setIsEditing, setIsModalOpen, ["documentNumber"]);

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
    featureName = "Police Clearance"
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

