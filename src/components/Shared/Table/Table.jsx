import React, { useContext } from "react";
import SearchBar from "./SearchBar";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { MainContext } from '../../../context/MainContext';
import SelectField from "../Form/SelectField";

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
  additionalComponents,
  generatePDF,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sortOption,
  setSortOption,
}) => {
  const { user } = useContext(MainContext);
  return (
    <div className="content">
      <div className="table-container">
        <div>
            <h2>{featureName}</h2>
            <div>
              <button className="blue" onClick={generatePDF}>Report</button>
              <SelectField
              id="gender"
              name="gender"
              options={[
                { value: "newest", display: "Newest to Oldest" },
                { value: "oldest", display: "Oldest to Newest" },
                { value: "lastname", display: "Last Name (A-Z)" },
              ]}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              width="120px"
              />
              <input
                type="text"
                value={startDate ? new Date(startDate).toLocaleDateString("en-US") : ""}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
                style={{
                  width: "120px",
                  textIndent: "5px"
                }}
              />
              <input
                type="text"
                value={endDate ? new Date(endDate).toLocaleDateString("en-US") : ""}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
                style={{
                  width: "120px",
                  textIndent: "5px"
                }}
              />
              {user && user.searchUSerAction && (
                <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder="Search..."
                />
            )}
            </div>
            
        </div>
        <table>
            <TableHeader columns={columns} />
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((record) => (
                <TableRow
                  key={record.id}
                  record={record}
                  columns={columns}
                  handleManage={handleManage}
                  deleteRecord={deleteRecord}
                />
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: "center", padding: "10px" }}>
                  No records found
                </td>
              </tr>
            )}
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

