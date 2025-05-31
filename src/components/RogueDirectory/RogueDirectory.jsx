import React, { useContext } from "react";
import Table from "../Shared/Table/Table";
import { RogueDirectoryContext } from "../../context";
import RogueDirectoryForm from "./RogueDirectoryForm";

const RogueDirectory = () => {
  const featureName = "Rogue Directory";
  const columns = [
    { key: "ccisNumber", label: "CCIS No." },
    { key: "crimeCommitted", label: "Description" },
    { key: "committedDate", label: "Committed Date:" },
    { key: "lastName", label: "LName" },
    { key: "firstName", label: "FName" },
    { key: "middleName", label: "MName" },
    { key: "dateOfBirth", label: "DOB" },
  ];
  const searchOptions = [
    { value: "fullName", label: "Full Name (LN FN MN)" },
    { value: "crimeCommitted", label: "Crime Committed" },
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
  } = useContext(RogueDirectoryContext);

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      deleteRecord={deleteRecord}
      setIsModalOpen={setIsModalOpen}
      setIsEditing={setIsEditing}
      setSelectedData={setSelectedData}
      featureName={featureName.toUpperCase()}
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
          <RogueDirectoryForm />
        </>
      )}
    />
  );
};

export default RogueDirectory;

