import React from "react";
import Table from "../Shared/Table/Table";

const PoliceClearanceTable = () => {
  const columns = [
    { key: "documentNumber", label: "Doc #" },
    { key: "documentDate", label: "Document Date" },
    { key: "pcNumber", label: "PC #", render: () => "12345" },
    { key: "orNumber", label: "OR #" },
    { key: "orDate", label: "OR Date" },
    { key: "lastName", label: "Name" },
    { key: "user", label: "User", render: () => "Robin" },
  ];
  
  return (
    <Table columns = {columns} />
  );
};

export default PoliceClearanceTable;

