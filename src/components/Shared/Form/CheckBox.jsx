import React from "react";

const CheckBox = ({ id, label, checked, onChange }) => {
  return (
    <div className="checkbox-container">
      <label htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.id, e.target.checked)}
        />
        {label}
      </label>
    </div>
  );
};

export default CheckBox;