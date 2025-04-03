import React, { useContext } from "react";
import Table from "../Shared/Table/Table";
import { UserStatusContext } from "../../context";
import useUserStatusTable from "../../hooks/useTable";
import UserForm from "./Form";

const UserStatus = () => {

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
    
      return items.length === 5 ? "ALL" : items.join(", ");
    }},
    { key: "userActions", label: "User Actions", render: (record) => {
      const actions = [
        record.addUSerAction && "add",
        record.searchUSerAction && "search",
        record.editUSerAction && "edit",
        record.printUSerAction && "print",
        record.deleteUSerAction && "delete"
      ].filter(Boolean);
    
      return actions.length === 5 ? "ALL" : actions.join(", ");
    }},
  ];
 
  const {
    searchQuery,
    setSearchQuery,
    filteredData,
    handleManage,
  } = useUserStatusTable(data, setSelectedData, setIsEditing, setIsModalOpen, ["username"]);

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
    featureName = {"User Status"}
    additionalComponents={() => (
      <>
        <UserForm />
      </>
    )}
    />
  );
};

export default UserStatus;

