import React, { useContext } from "react";
import Table from "../Shared/Table/Table";
import { BarangayClearanceContext } from "../../context";
import BarangayClearanceForm from "./BarangayClearanceForm";

const BarangayClearance = () => {
  const context = useContext(BarangayClearanceContext);
  const featureName = "Barangay Clearance";
  const columns = [
    { key: "documentNumber", label: "Doc #" },
    { key: "documentDate", label: "Document Date" },
    // { key: "pcNumber", label: "PC #", render: () => "12345" },
    { key: "orNumber", label: "OR #" },
    { key: "orDate", label: "OR Date" },
    { key: "lastName", label: "Name", render: (row) => `${row.lastName}, ${row.firstName} ${row.middleName}` },
    { key: "user", label: "User" },
  ];
  
  const searchOptions = [
    { value: "last_name", label: "Full Name (LN, FN MN)" },
    { value: "document_number", label: "Document Number" }
  ];
    const sortOptions = [
    { value: "newest", display: "Newest to Oldest" },
    { value: "oldest", display: "Oldest to Newest" },
  ];

  return (
    <Table
      columns={columns}
      featureName={featureName.toUpperCase()}
      searchOptions={searchOptions}
      sortOptions={sortOptions}
      context={context}
      additionalComponents={() => (
        <>
          <BarangayClearanceForm />
        </>
      )}
    />
  );
};

export default BarangayClearance;

