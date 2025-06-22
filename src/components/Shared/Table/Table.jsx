import React, { useContext, useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { MainContext } from '../../../context/MainContext';
import SelectField from "../Table/SelectField";
import useTable from "../../../hooks/useTable";
import { FaPlus, FaSpinner } from 'react-icons/fa';

const Table = ({ 
  columns,
  featureName,
  searchOptions,
  sortOptions,
  additionalComponents,
  context,
}) => {
  const { user } = useContext(MainContext);
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
  const [verifiedFilter, setVerifiedFilter] = useState('all');

  // Filter data for Resident Management feature
  const filteredData = useMemo(() => {
    if (featureName !== 'RESIDENT MANAGEMENT') return data;
    if (verifiedFilter === 'all') return data;
    if (verifiedFilter === 'verified') {
      return data.filter((record) => record.isBarangayVerified === true);
    }
    if (verifiedFilter === 'unverified') {
      return data.filter((record) => record.isBarangayVerified === false);
    }
    return data;
  }, [data, featureName, verifiedFilter]);

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

        <div>
          {/* Radio button to filter verified resident, only appears when feature name is 'RESIDENT MANAGEMENT' */}
          {featureName === 'RESIDENT MANAGEMENT' && (
            <div style={{ marginBottom: '10px' }}>
              <span>Filter: </span>
              <label style={{ marginRight: '10px' }}>
                <input
                  type="radio"
                  name="verifiedFilter"
                  value="all"
                  checked={verifiedFilter === 'all'}
                  onChange={() => setVerifiedFilter('all')}
                />
                All
              </label>
              <label style={{ marginRight: '10px' }}>
                <input
                  type="radio"
                  name="verifiedFilter"
                  value="verified"
                  checked={verifiedFilter === 'verified'}
                  onChange={() => setVerifiedFilter('verified')}
                />
                Verified
              </label>
              <label>
                <input
                  type="radio"
                  name="verifiedFilter"
                  value="unverified"
                  checked={verifiedFilter === 'unverified'}
                  onChange={() => setVerifiedFilter('unverified')}
                />
                Unverified
              </label>
            </div>
          )}
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
            ) : filteredData && filteredData.length > 0 ? (
              filteredData.map((record) => (
                <TableRow
                  key={record.userId}
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
          {/* {add toggle to filter verified resident, this radio button appears when feature name is = to user management} */}
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

