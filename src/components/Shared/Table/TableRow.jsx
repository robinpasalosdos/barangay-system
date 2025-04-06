import React from "react";
import ActionButtons from "./ActionButtons";

const TableRow = ({ record, columns, featureName, handleManage, deleteRecord }) => {
  return (
    <tr>
      {columns.map(({ key, render }) => (
        <td key={key}>
          {render ? render(record) : record[key]}
        </td>
      ))}
      <td>
        <ActionButtons record={record} featureName={featureName} handleManage={handleManage} deleteRecord={deleteRecord} />
      </td>
    </tr>
  );
};

export default TableRow;
