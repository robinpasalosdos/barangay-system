import React, { useContext } from "react";
import Table from "../Shared/Table/Table";
import { WarrantBookingContext } from "../../context";
import WarrantBookingForm from "./WarrantBookingForm";


const WarrantBooking = () => {
  const columns = [
    { key: "ccisNumber", label: "CCIS No." },
    { key: "crimeCommitted", label: "CCIS Description" },
    { key: "committedDate", label: "CCIS Committed Date:" },
    { key: "lastName", label: "LName" },
    { key: "firstName", label: "FName" },
    { key: "middleName", label: "MName" },
    { key: "dateOfBirth", label: "DOB" }
  ];
  const featureName = "Warrant Booking";
  const context = useContext(WarrantBookingContext);
  const searchOptions = [
    { value: "fullName", label: "Full Name |LN FN MN|" },
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
        <WarrantBookingForm />
      </>
    )}
    />
  );
};

export default WarrantBooking;

