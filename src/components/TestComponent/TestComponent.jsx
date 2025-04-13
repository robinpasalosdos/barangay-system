import React from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './TestComponent.css';

const TestComponent = () => {
  return (
    <div className="warrant-booking-container content">
      <div className="warrant-card">
        <div className="card-header">
          <h2>WARRANT BOOKING</h2>
          
          <div className="filters-container">
            <div className="search-group">
              <FaSearch className="search-icon" />
              <input 
                type="text"
                placeholder="Search..."
                className="search-input"
              />
            </div>

            <div className="date-filters">
              <input
                type="date"
                className="date-input"
                placeholder="Start Date"
              />
              <input
                type="date"
                className="date-input"
                placeholder="End Date"
              />
            </div>

            <select className="filter-select">
              <option value="">Filter By</option>
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="warrant-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Date Filed</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data row */}
              <tr>
                <td>John Robert Doe</td>
                <td>Apr 12, 2025</td>
                <td>
                  <span className="status-badge pending">Pending</span>
                </td>
                <td className="actions-cell">
                  <button className="action-btn edit">
                    <FaEdit />
                  </button>
                  <button className="action-btn delete">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button className="add-record-btn">
          <FaPlus />
          <span>Add New Record</span>
        </button>
      </div>
    </div>
  );
};

export default TestComponent;