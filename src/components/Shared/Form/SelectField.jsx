import React from "react";

const SelectField = ({ label, id, name, options, value, onChange }) => (
  <div className="select-wrapper">
    <label htmlFor={id}>{label}</label>
    <select id={id} name={name} value={value} onChange={onChange}>
      <option value="" disabled>
        Select {label}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;
