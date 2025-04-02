import React, { useContext } from "react";
import Table from "../Shared/Table/Table";
import { WarrantBookingContext } from "../../context";
import useTable from "../../hooks/useTable";
import WarrantBookingForm from "./WarrantBookingForm";


const WarrantBooking = () => {
  const columns = [
    { key: "ccisNumber", label: "CCIS No." },
    { key: "crimeCommitted", label: "CCIS Description." },
    { key: "committedDate", label: "CCIS Committed Date:" },
    { key: "lastName", label: "LName" },
    { key: "middleName", label: "FName" },
    { key: "firstName", label: "MName" },
    { key: "dateOfBirth", label: "DOB" }
  ];
  const context = useContext(WarrantBookingContext);
 
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
  } = useTable(data, setSelectedData, setIsEditing, setIsModalOpen, ["lastName"]);

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
    featureName = "Warrant Booking"
    additionalComponents={() => (
      <>
        <WarrantBookingForm />
      </>
    )}
    />
  );
};

export default WarrantBooking;

