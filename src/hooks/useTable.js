import { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const useTable = (data, setSelectedData, setIsEditing, setIsModalOpen, featureName, columns) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [searchBy, setSearchBy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredData = useMemo(() => {
    let sortedData = [...data];

    sortedData = sortedData.filter((record) => {
      let value = "";

      if (searchBy === "fullName") {
        const formattedName = `${record.lastName}, ${record.firstName} ${record.middleName || ""}`
          .trim()
          .toLowerCase();
        value = formattedName;
      } else {
        value = record[searchBy]?.toLowerCase() || "";
      }

    const matchesSearch = value.includes(searchQuery.toLowerCase());

      const recordDate = new Date(record.createdTimestamp);
      const isWithinDateRange =
        (!startDate || recordDate >= new Date(startDate)) &&
        (!endDate || recordDate <= new Date(endDate));

      return matchesSearch && isWithinDateRange;
    });

    sortedData.sort((a, b) => {
      if (sortOption === "newest") return new Date(b.createdTimestamp) - new Date(a.createdTimestamp);
      if (sortOption === "oldest") return new Date(a.createdTimestamp) - new Date(b.createdTimestamp);
      if (sortOption === "lastname") return a.lastName.localeCompare(b.lastName);
      return 0;
    });

    return sortedData;
  }, [searchQuery, startDate, endDate, data, searchBy, sortOption]);

  // Handle managing a record (e.g., editing)
  const handleManage = (record) => {
    setSelectedData(record);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Title Styling
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${featureName} Report`, 14, 15);
  
    // Date and Footer
    doc.setFontSize(10);
    const date = new Date().toLocaleDateString();
    doc.text(`Generated on: ${date}`, 14, 22);
    
    const tableColumn = columns.map(col => col.label);
  
    // Apply styling for table rows
    const tableRows = filteredData.map((record, index) => 
      columns.map(col => 
        col.render ? col.render(record) : record[col.key] || "" // Handle render functions
      )
    );
  
    autoTable(doc, { 
      head: [tableColumn],
      body: tableRows,
      startY: 30, // Adjust table position
      styles: { fontSize: 10, cellPadding: 3 }, // General table style
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255], fontStyle: "bold" }, // Header styling (blue)
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Light gray alternating rows
      columnStyles: { 0: { halign: 'center' } }, // Center align first column
    });
  
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Page ${i} of ${pageCount}`, 180, 290);
    }
  
    doc.save(`${featureName}_report.pdf`);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchBy,
    setSearchBy,
    sortOption,
    setSortOption,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredData,
    handleManage,
    generatePDF
  };
};

export default useTable;
