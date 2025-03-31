import React, { useState } from "react";

const CheckBoxList = ({ items, onChange }) => {
  const [checkedItems, setCheckedItems] = useState(
    items.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  );

  const handleCheckboxChange = (item) => {
    const updatedCheckedItems = {
      ...checkedItems,
      [item]: !checkedItems[item],
    };
    setCheckedItems(updatedCheckedItems);
    onChange && onChange(updatedCheckedItems); // Pass the updated state to the parent if needed
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item} style={{ marginBottom: "8px" }}>
          <label>
            <input
              type="checkbox"
              checked={checkedItems[item]}
              onChange={() => handleCheckboxChange(item)}
            />
            {item}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckBoxList;