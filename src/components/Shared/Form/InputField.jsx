import React from "react";

const InputField = ({ label, id, name, type = "text", placeholder, readOnly, style, value, onChange, onBlur }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name} // Ensure name is passed
        placeholder={placeholder}
        readOnly={readOnly}
        style={style}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );

export default InputField;
