import React, { useContext } from "react";
import Table from "../Shared/Table/Table";
import { ResidentContext } from "../../context";
import ResidentManagementForm from "./ResidentManagementForm";

const ResidentManagement = () => {
  const context = useContext(ResidentContext);

  const sortOptions = [
    { value: "newest", display: "Newest to Oldest" },
    { value: "oldest", display: "Oldest to Newest" },
    { value: "lastName", display: "Last Name (A-Z)" },
    { value: "email", display: "Email (A-Z)" },
  ];

  const searchOptions = [
    { value: "last_name", label: "Last Name" },
    { value: "email", label: "Email" },
  ];

  const columns = [
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    {
      key: "address",
      label: "Address",
      render: (record) => record.address || "N/A",
    },
    {
      key: "contactNumber",
      label: "Contact Number",
      render: (record) => record.contactNumber || "N/A",
    },
  ];

  return (
    <Table
      columns={columns}
      searchOptions={searchOptions}
      sortOptions={sortOptions}
      context={context}
      additionalComponents={() => (
        <>
          <ResidentManagementForm />
        </>
      )}
    />
  );
};

export default ResidentManagement;