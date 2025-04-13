import React from "react";

const InputField = ({
  label,
  id,
  name,
  type = "text",
  placeholder,
  readOnly,
  style = {},
  value,
  onChange,
  onBlur,
  width,
  height,
}) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      readOnly={readOnly}
      style={{ ...style, width, height }}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  </div>
);

export default InputField;
