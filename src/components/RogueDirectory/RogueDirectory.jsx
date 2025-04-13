import React, { useContext } from "react";
import Table from "../Shared/Table/Table";
import { RogueDirectoryContext } from "../../context";
import RogueDirectoryForm from "./RogueDirectoryForm";

const RogueDirectory = () => {
  const columns = [
    { key: "ccisNumber", label: "CCIS No." },
    { key: "crimeCommitted", label: "CCIS Description" },
    { key: "committedDate", label: "CCIS Committed Date:" },
    { key: "lastName", label: "LName" },
    { key: "firstName", label: "FName" },
    { key: "middleName", label: "MName" },
    { key: "dateOfBirth", label: "DOB" }
  ];
  const featureName = "Rogue Directory";
  const context = useContext(RogueDirectoryContext);
  const searchOptions = [
    { value: "fullName", label: "Full Name (LN FN MN)" },
    { value: "crimeCommitted", label: "Crime Committed" }
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
    featureName = {featureName.toUpperCase()}
    searchOptions = {searchOptions}
    additionalComponents={() => (
      <>
        <RogueDirectoryForm />
      </>
    )}
    />
  );
};

export default RogueDirectory;

