import React from "react";

const FormButtons = ({ isEditing, onClose, onSubmit}) => {
  return (
    <div>
      {isEditing ? (
        <>
        
          <button id="updateDataBtn" className="blue" onClick={onSubmit}>UPDATE</button>
          <button className="purple">PRINT</button>
          <button className="red">DELETE</button>
          <button className="red" onClick={onClose}>CANCEL</button>
        </>
      ) : (
        <>
          <button id="createDataBtn" className="blue" onClick={onSubmit}>SAVE</button>
          <button id="saveAndPrint" className="purple">SAVE AND PRINT</button>
          <button type="button" className="purple" onClick={onClose}>CANCEL</button>
        </>
      )}
    </div>
  );
};

export default FormButtons;