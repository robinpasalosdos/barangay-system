import React, { useContext } from "react";
import Table from "../Shared/Table/Table";
import { PoliceClearanceContext } from "../../context";
import PoliceClearanceFaceCapture from "./PoliceClearanceFaceCapture";
import PoliceClearanceForm from "./PoliceClearanceForm";
import SingleHandFingerprintCapture from "./SingleHandFingerprintCapture";

const PoliceClearance = () => {
  const featureName = "Police Clearance";
  const columns = [
    { key: "documentNumber", label: "Doc #" },
    { key: "documentDate", label: "Document Date" },
    // { key: "pcNumber", label: "PC #", render: () => "12345" },
    { key: "orNumber", label: "OR #" },
    { key: "orDate", label: "OR Date" },
    { key: "lastName", label: "Name" },
    { key: "user", label: "User" },
  ];
  const context = useContext(PoliceClearanceContext);
  const searchOptions = [
    { value: "fullName", label: "Full Name |LN FN MN|" },
    { value: "documentNumber", label: "Document Number" }
  ];
  const {
    data,
    setIsModalOpen,
    setIsEditing,
    setSelectedData,
    deleteRecord,
  } = context;

  return (
    <Table 
    columns = {columns}
    data = {data}
    deleteRecord = {deleteRecord}
    setIsModalOpen = {setIsModalOpen}
    setIsEditing = {setIsEditing}
    setSelectedData = {setSelectedData}
    featureName = {featureName}
    searchOptions = {searchOptions}
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

