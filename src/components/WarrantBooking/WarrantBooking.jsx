import React, { useContext } from "react";
import Table from "../Shared/Table/Table";
import { WarrantBookingContext } from "../../context";
import WarrantBookingForm from "./WarrantBookingForm";
import MugshotCapture from "./MugshotCapture";
import FingerprintCapture from "./FingerprintCapture";

const WarrantBooking = () => {
  const featureName = "Warrant Booking";
  const columns = [
    { key: "ccisNumber", label: "CCIS No." },
    { key: "crimeCommitted", label: "CCIS Description" },
    { key: "committedDate", label: "CCIS Committed Date:" },
    { key: "lastName", label: "LName" },
    { key: "firstName", label: "FName" },
    { key: "middleName", label: "MName" },
    { key: "dateOfBirth", label: "DOB" },
  ];
  const searchOptions = [
    { value: "last_name", label: "Full Name (LN FN MN)" },
    { value: "crime_committed", label: "Crime Committed" },
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
  } = useContext(WarrantBookingContext);

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      deleteRecord={deleteRecord}
      setIsModalOpen={setIsModalOpen}
      setIsEditing={setIsEditing}
      setSelectedData={setSelectedData}
      featureName={featureName}
      searchOptions={searchOptions}
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
          <WarrantBookingForm />
          <MugshotCapture />
          <FingerprintCapture />
        </>
      )}
    />
  );
};

export default WarrantBooking;

