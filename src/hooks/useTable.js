import { useContext, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const useTable = ({
  data,
  fetchRecords,
  setSelectedData,
  setIsEditing,
  setIsModalOpen,
  featureName,
  columns,
  searchQuery,
  searchBy,
  startDate,
  endDate,
  sortOption,
}) => {
  
  useEffect(() => {
    if (fetchRecords) {
      fetchRecords();
    }
  }, [fetchRecords, searchQuery, searchBy, startDate, endDate, sortOption]);


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
    const tableRows = data.map((record, index) => 
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
    data,
    handleManage,
    generatePDF
  };
};

export default useTable;
