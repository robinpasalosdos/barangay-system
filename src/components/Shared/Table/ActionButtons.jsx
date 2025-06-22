import React, { useContext, useState } from "react";
import { MainContext } from '../../../context/MainContext';
import { FaEdit, FaTrash, FaPrint } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, recordName }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="delete-confirmation-modal">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete {recordName}? This action cannot be undone.</p>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="delete-button" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </>
  );
};

const ActionButtons = ({ record, featureName, handleManage, deleteRecord }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const handlePrint = () => {
    window.api.printRecord(record);
  };
  const { user } = useContext(MainContext);
  const isUser = record.username === user.username || record.username === "admin";

  const handleDelete = () => {
    if (!isUser) {
      setShowDeleteDialog(true);
    }
  };

  const handleConfirmDelete = () => {
    deleteRecord(record.userId);
    toast.success(`Record "${record.username || record.userId}" deleted successfully!`);
    setShowDeleteDialog(false);
  };

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
      
      {featureName === "Barangay Clearance" && (
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
          onClick={handleDelete}
          title={isUser ? "You cannot delete this record" : "Delete Record"}
          aria-disabled={isUser}
        >
          <FaTrash />
        </button>
      )}

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        recordName={record.username || record.user_id}
      />
    </div>
  );
};

export default ActionButtons;