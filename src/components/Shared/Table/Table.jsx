import React, { useContext } from "react";
import SearchBar from "./SearchBar";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { MainContext } from '../../../context/Context'


const Table = ({ 
  columns, 
  searchQuery,
  setSearchQuery,
  filteredData,
  handleManage,
  deleteRecord,
  setIsModalOpen,
  setIsEditing,
  setSelectedData,
  featureName,
  additionalComponents
}) => {
  const { user } = useContext(MainContext);
  return (
    <div className="content">
      <div className="table-container">
        <div>
            <h2>{featureName}</h2>
            {user && user.searchUSerAction && (
              <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search by name, purpose, or gender"
              />
            )}
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
          {user && user.addUSerAction && (
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
          )}
        </div>
      </div>
      {additionalComponents && additionalComponents()}
    </div>
  );
};

export default Table;

