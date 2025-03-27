import React from "react";

const ActionButtons = ({ record, handleManage, deleteRecord }) => {
  return (
    <>
      <button className="blue" onClick={() => handleManage(record)}>
        Manage
      </button>
      <button className="red" onClick={() => deleteRecord(record.id)}>
        Delete
      </button>
    </>
  );
};

export default ActionButtons;