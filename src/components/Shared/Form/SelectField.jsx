import React, { useState } from "react";

const SelectField = ({ label, id, name, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFocus = () => setIsOpen(false);
  const handleBlur = () => setIsOpen(false);

  return (
    <div
      className={`select-wrapper ${isOpen ? "open" : ""}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <label htmlFor={id}>{label}</label>
      <select id={id} name={name} value={value} onChange={onChange} onClick={() => setIsOpen((prev) => !prev)}>
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
};

export default SelectField;
