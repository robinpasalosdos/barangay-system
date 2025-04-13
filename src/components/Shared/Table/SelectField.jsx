import React, { useState } from "react";

const SelectField = ({ label, id, name, options, value, onChange, width }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFocus = () => setIsOpen(false);
  const handleBlur = () => setIsOpen(false);

  return (
    <div
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <select id={id} name={name} value={value} onChange={onChange} onClick={() => setIsOpen((prev) => !prev)} style={{ width: width }}>
        {options.map((option, index) => (
          <option key={index} value={typeof option === "object" ? option.value : option}>
            {typeof option === "object" ? option.display : option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
