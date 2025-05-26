import React, { useContext } from "react";
import Table from "../Shared/Table/Table";
import { UserStatusContext } from "../../context";
import UserForm from "./Form";

const UserStatus = () => {
  const featureName = "User Management";
  const context = useContext(UserStatusContext);

  const {
    data,
    loading,
    fetchRecords,
    isModalOpen,
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
  } = context;

  const sortOptions = [
    { value: "newest", display: "Newest to Oldest" },
    { value: "oldest", display: "Oldest to Newest" },
    { value: "username", display: "Username (A-Z)" },
    { value: "email", display: "Email (A-Z)" },
  ];

  const searchOptions = [
    { value: "email", label: "Email" },
    { value: "username", label: "Username" },
  ];

  const columns = [
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    {
      key: "pages",
      label: "Pages",
      render: (record) => {
        const items = [
          record.policeClearance && "PC",
          record.warrantBooking && "WB",
          record.rogueDirectory && "RD",
          record.userStatus && "UM",
        ].filter(Boolean);

        return items.length === 0 ? "NONE" : items.length === 4 ? "ALL" : items.join(", ");
      },
    },
    {
      key: "userActions",
      label: "User Actions",
      render: (record) => {
        const actions = [
          record.addUserAction && "add",
          record.searchUserAction && "search",
          record.editUserAction && "edit",
          record.printUserAction && "print",
          record.deleteUserAction && "delete",
        ].filter(Boolean);

        return actions.length === 0 ? "NONE" : actions.length === 5 ? "ALL" : actions.join(", ");
      },
    },
    { 
      key: "emailConfirmedAt",
      label: "Verified",
      render: (record) => {
        return record.emailConfirmedAt ? "YES" : "NO";
      }
    }
  ];

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      deleteRecord={deleteRecord}
      isModalOpen={isModalOpen}
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
          <UserForm />
        </>
      )}
    />
  );
};

export default UserStatus;