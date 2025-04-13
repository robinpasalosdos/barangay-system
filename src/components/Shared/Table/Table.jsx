import React, { useContext } from "react";
import SearchBar from "./SearchBar";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { MainContext } from '../../../context/MainContext';
import SelectField from "../Table/SelectField";
import useTable from "../../../hooks/useTable";
import { FaPlus } from 'react-icons/fa';

const Table = ({ 
  columns,
  data, 
  deleteRecord,
  setIsModalOpen,
  setIsEditing,
  setSelectedData,
  featureName,
  searchOptions,
  additionalComponents
}) => {
  const { user } = useContext(MainContext);
  const {
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
      filteredData,
      handleManage,
      generatePDF
    } = useTable(data, setSelectedData, setIsEditing, setIsModalOpen, featureName, columns);
  return (
    <div className="content">
      <div className="table-container">
        <div>
            <h2>{featureName.toUpperCase()}</h2>
            <div>
              <div>
                <span>Search</span>
                {user && user.searchUSerAction && (
                  <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Search..."
                  />
                )}
              </div>
              <div>
                <span>Search By</span>
                <SelectField
                  id="searchBy"
                  name="searchBy"
                  options={searchOptions.map((opt) => ({
                    value: opt.value,
                    display: opt.label,
                  }))}
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                  width="140px"
                />
              </div>
              <div>
                <span>Sort By</span>
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
                  width="140px"
                />
              </div>
              <div>
                <span>Start Date</span>
                <input
                  type="text"
                  value={startDate ? new Date(startDate).toLocaleDateString("en-US") : ""}
                  onFocus={(e) => (e.target.type = "date")}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Enter Start Date"
                  style={{
                    width: "120px",
                    textIndent: "5px"
                  }}
                />
              </div>
              <div>
                <span>End Date</span>
                <input
                  type="text"
                  value={endDate ? new Date(endDate).toLocaleDateString("en-US") : ""}
                  onFocus={(e) => (e.target.type = "date")}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="Enter End Date"
                  style={{
                    width: "120px",
                    textIndent: "5px"
                  }}
                />
              </div>
              <div>
                <button className="yellow" onClick={generatePDF}>Report</button>
              </div>
              
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
                  featureName={featureName}
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
            className="yellow"
            onClick={() => {
              setIsModalOpen(true);
              setIsEditing(false);
              setSelectedData(null);
            }}
            style={{width: "150px"}}
          >
            <FaPlus className="plusIcon"/>
            <span>  Add New Record</span>
          </button>
          )}
        </div>
      </div>
      {additionalComponents && additionalComponents()}
    </div>
  );
};

export default Table;

