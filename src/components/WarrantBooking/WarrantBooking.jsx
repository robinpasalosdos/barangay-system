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
  const featureName = "Warrant Booking";
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
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortOption,
    setSortOption,
    filteredData,
    handleManage,
    generatePDF
  } = useTable(data, setSelectedData, setIsEditing, setIsModalOpen, featureName, columns, ["lastName"]);

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
        <WarrantBookingForm />
      </>
    )}
    />
  );
};

export default WarrantBooking;

