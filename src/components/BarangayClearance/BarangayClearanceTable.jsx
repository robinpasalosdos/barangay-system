import React, { useContext, useState } from "react";
import { BarangayClearanceContext } from "../../context/BarangayClearanceContext";
import BarangayClearanceForm from "./BarangayClearanceForm";
import SearchBar from "../Shared/Table/SearchBar";
import TableHeader from "../Shared/Table/TableHeader";
import TableRow from "../Shared/Table/TableRow";

const BarangayClearanceTable = () => {
  const context = useContext(BarangayClearanceContext);

  if (!context) {
    console.error("BarangayContext is not provided. Wrap the component with BarangayProvider.");
    return null;
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "lastName", label: "Last Name" },
    {
      key: "birthdate",
      label: "Age",
      render: (value, record) => calculateAge(value),
    },
    { key: "birthplace", label: "Birthplace" },
    { key: "gender", label: "Gender" },
    { key: "purpose", label: "Purpose" },
    { key: "contactNumber", label: "Contact Number" },
    { key: "findings", label: "Findings" },
    { key: "dateIssued", label: "Date Issued" },
  ];
  
  const {
    data,
    isModalOpen,
    setIsModalOpen,
    isEditing,
    setIsEditing,
    selectedData,
    setSelectedData,
    deleteRecord,
  } = context;

  const [searchQuery, setSearchQuery] = useState("");

  const handleManage = (record) => {
    setSelectedData(record);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const calculateAge = (birthdate) => {
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const filteredData = data.filter((record) => {
    const fullName = `${record.lastName} ${record.firstName} ${record.middleName}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      record.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.gender.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="content">
      <div className="table-container">
        <div>
            <h2>BARANGAY CLEARANCE</h2>
            <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search by name, purpose, or gender"
            />
        </div>
        <table>
            <TableHeader columns={columns} />
          <tbody>
            {filteredData.map((record) => (
              <TableRow
                key={record.id}
                record={record}
                columns={columns}
                handleManage={handleManage}
                deleteRecord={deleteRecord}
                calculateAge={calculateAge}
              />
            ))}
          </tbody>
        </table>
        <button
          className="blue"
          onClick={() => {
            setIsModalOpen(true);
            setIsEditing(false);
            setSelectedData(null);
          }}
        >
          Add New Record
        </button>
      </div>
      <BarangayClearanceForm />
    </div>
  );
};

export default BarangayClearanceTable;

