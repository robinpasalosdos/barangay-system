import React from "react";

const TableHeader = ({ columns }) => {
  return (
    <thead>
      <tr>
        {columns.map(({ key, label }) => (
          <th key={key}>{label}</th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;