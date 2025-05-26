import React, { useContext } from "react";
import SearchBar from "./SearchBar";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { MainContext } from '../../../context/MainContext';
import SelectField from "../Table/SelectField";
import useTable from "../../../hooks/useTable";
import { FaPlus, FaSpinner } from 'react-icons/fa';

const Table = ({ 
  data,
  loading,
  columns,
  deleteRecord,
  isModalOpen,
  setIsModalOpen,
  setIsEditing,
  setSelectedData,
  featureName,
  searchOptions,
  sortOptions,
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
  fetchRecords,
  additionalComponents
}) => {
  const { user } = useContext(MainContext);
  const {
      handleManage,
      generatePDF
    } = useTable({
      data,
      fetchRecords,
      setSelectedData,
      setIsEditing,
      setIsModalOpen,
      featureName,
      columns,
      searchQuery,
      searchBy,
      startDate,
      endDate,
      sortOption,
    });
  return (
    <div className="content">
      {isModalOpen && <div className="overlay"></div>}
      <div className="table-container">
        <div>
            <h2>{featureName.toUpperCase()}</h2>
            <div>
              {user && user.searchUserAction && (
                <>
                  <div>
                    <span>Search</span>
                    
                      <SearchBar
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      placeholder="Search..."
                      />
                    
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
                      id="sortOption"
                      name="sortOption"
                      options={sortOptions.map((opt) => ({
                        value: opt.value,
                        display: opt.display,
                      }))}
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
                </>
              )}
              <div>
                <button className="yellow" onClick={generatePDF}>Report</button>
              </div>        
            </div>     
        </div>

        <table>
          <TableHeader columns={columns} />
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: "center", padding: "10px" }}>
                  <FaSpinner className="spinner" /> {/* Show spinner when loading */}
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((record) => (
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
          {user && user.addUserAction && (
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

