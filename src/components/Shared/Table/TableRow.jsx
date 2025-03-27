import React from "react";
import ActionButtons from "./ActionButtons";

const TableRow = ({ record, columns, handleManage, deleteRecord }) => {
  return (
    <tr>
      {columns.map(({ key, render }) => (
        <td key={key}>
          {render ? render(record[key], record) : record[key]}
        </td>
      ))}
      <td>
        <ActionButtons record={record} handleManage={handleManage} deleteRecord={deleteRecord} />
      </td>
    </tr>
  );
};

export default TableRow;
