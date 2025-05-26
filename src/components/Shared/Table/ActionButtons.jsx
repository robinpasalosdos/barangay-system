import React, { useContext } from "react";
import { MainContext } from '../../../context/MainContext';
import { FaEdit, FaTrash, FaPrint } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ActionButtons = ({ record, featureName, handleManage, deleteRecord }) => {
  const handlePrint = () => {
    window.api.printRecord(record);
  };
  const { user } = useContext(MainContext);
  const isUser = record.username === user.username || record.username === "admin";
  return (
    <div className="action-buttons">
      <button 
        className={`action-button edit ${isUser ? "disabled" : ""}`}
        onClick={() => {
          if (!isUser) {
            handleManage(record);
          }
        }}
        title={isUser ? "You cannot edit this record" : "Edit Record"}
        aria-disabled={isUser}
      >
        <FaEdit/>
      </button>
      
      {featureName === "Police Clearance" && (
        <button
          className="action-button print"
          onClick={handlePrint}
          title="Print Record"
        >
          <FaPrint/>
        </button>
      )}
      {user && user.deleteUserAction && (
        <button 
          className={`action-button delete ${isUser ? "disabled" : ""}`}
          onClick={() => {
            if (!isUser) {
              deleteRecord(record.id);
              toast.success(`Record "${record.username || record.id}" deleted successfully!`);
            }
          }}
          title={isUser ? "You cannot delete this record" : "Delete Record"}
          aria-disabled={isUser}
        >
          <FaTrash />
        </button>
        
      )}
    </div>
  );
};

export default ActionButtons;