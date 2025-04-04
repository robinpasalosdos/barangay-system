import React, { useContext } from "react";
import Table from "../Shared/Table/Table";
import { UserStatusContext } from "../../context";
import useTable from "../../hooks/useTable";
import UserForm from "./Form";

const UserStatus = () => {
  const featureName = "User Management";
  const context = useContext(UserStatusContext);

  const {
    data,
    setIsModalOpen,
    setIsEditing,
    setSelectedData,
    deleteRecord,
  } = context;

  if (!context) {
    console.error("UserStatusContext is undefined. Ensure the provider is wrapping the component.");
    return <p>Error: Context is not available.</p>;
  }

  const columns = [
    { key: "username", label: "Username" },
    { key: "pages", label: "Pages", render: (record) => {
      const items = [
        record.policeClearance && "PC",
        record.citizenInformation && "CI",
        record.warrantBooking && "WB",
        record.rogueDirectory && "RD",
        record.userStatus && "UM"
      ].filter(Boolean);
    
      return items.length === 0 ? "NONE" : items.length === 5 ? "ALL" : items.join(", ");
    }},
    { key: "userActions", label: "User Actions", render: (record) => {
      const actions = [
        record.addUSerAction && "add",
        record.searchUSerAction && "search",
        record.editUSerAction && "edit",
        record.printUSerAction && "print",
        record.deleteUSerAction && "delete"
      ].filter(Boolean);
    
      return actions.length === 0 ? "NONE" : actions.length === 5 ? "ALL" : actions.join(", ");
    }},
  ];
 
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
    generatePDF
  } = useTable(data, setSelectedData, setIsEditing, setIsModalOpen, featureName, columns, ["username"]);

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
        <UserForm />
      </>
    )}
    />
  );
};

export default UserStatus;

