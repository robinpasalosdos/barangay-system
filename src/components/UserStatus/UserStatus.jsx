import React, { useContext } from "react";
import Table from "../Shared/Table/Table";
import { UserStatusContext } from "../../context/UserStatusContext";
import useUserStatusTable from "../../hooks/useUserStatusTable";
import UserForm from "./Form";


const UserStatus = () => {
  const columns = [
    { key: "userName", label: "Username" },
  ];
  const context = useContext(UserStatusContext);
 
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
  } = useUserStatusTable(data, setSelectedData, setIsEditing, setIsModalOpen);

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

