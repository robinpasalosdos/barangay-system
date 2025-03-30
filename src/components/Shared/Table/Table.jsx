import React, { useContext } from "react";
import PoliceClearanceForm from "../../PoliceClearance/PoliceClearanceForm";
import SearchBar from "./SearchBar";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import PoliceClearanceFaceCapture from "../../PoliceClearance/PoliceClearanceFaceCapture";
import { Context } from "../../../context/Context";
import useTable from "../../../hooks/useTable";

const Table = ({ columns }) => {
  const context = useContext(Context);
 
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
  } = useTable(data, setSelectedData, setIsEditing, setIsModalOpen);


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
              />
            ))}
          </tbody>
        </table>
        <div>
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

      </div>
      <PoliceClearanceForm />
      <PoliceClearanceFaceCapture />
    </div>
  );
};

export default Table;

