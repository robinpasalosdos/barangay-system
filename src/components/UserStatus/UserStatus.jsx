import React, { useContext } from "react";
import Table from "../Shared/Table/Table";
import { UserStatusContext } from "../../context";
import UserForm from "./Form";

const UserStatus = () => {
  const featureName = "User Management";
  const context = useContext(UserStatusContext);
  const searchOptions = [
    { value: "username", label: "Username" }
  ];
  if (!context) {
    console.error("UserStatusContext is undefined. Ensure the provider is wrapping the component.");
    return <p>Error: Context is not available.</p>;
  }

  const columns = [
    { key: "username", label: "Username" },
    { key: "pages", label: "Pages", render: (record) => {
      const items = [
        record.policeClearance && "PC",
        record.warrantBooking && "WB",
        record.rogueDirectory && "RD",
        record.userStatus && "UM"
      ].filter(Boolean);
    
      return items.length === 0 ? "NONE" : items.length === 4 ? "ALL" : items.join(", ");
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
        <UserForm />
      </>
    )}
    />
  );
};

export default UserStatus;

