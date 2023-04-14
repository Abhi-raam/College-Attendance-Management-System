// staff details printing
function generatePdf() {
    var doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });
    var pageTitle = document.getElementById('page-title').textContent;
    doc.setFontSize(15);
    doc.text("Staff Details of "+pageTitle, doc.internal.pageSize.width / 2, 10, { align: "center" });
    // Configure the columns to include in the PDF
    var columns = ['SNo', 'Name', 'Email', 'Phone', 'Staff Incharge', 'Designation'];
    // Extract the table data from the HTML table
    var data = [];
    var tableRows = document.querySelectorAll('#staffDetails tbody tr');
    tableRows.forEach(function (row, index) {
      var rowData = [];
      rowData.push(index + 1);
      rowData.push(row.querySelector('td:nth-child(3)').textContent.trim());
      rowData.push(row.querySelector('td:nth-child(4)').textContent.trim());
      rowData.push(row.querySelector('td:nth-child(5)').textContent.trim());
      rowData.push(row.querySelector('td:nth-child(6)').textContent.trim());
      rowData.push(row.querySelector('td:nth-child(7)').textContent.trim());
      data.push(rowData);
    });
    // Add the modified table to the PDF
    doc.autoTable({
      head: [columns],
      body: data,
      theme: 'grid',
      font: 'courier',
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 },
        4: { cellWidth: 50 },
        5: { cellWidth: 50 },
      }
    });
    doc.save(pageTitle+' Staff.pdf');
  }

// student details printing for staff
  function generatePdfStd() {
    //var doc = new jsPDF();
    var doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });
    var pageTitle = document.getElementById('page-title').textContent;
    doc.setFontSize(15); // Set font size for title
    doc.text(pageTitle, doc.internal.pageSize.width / 2, 10, { align: "center" }); // Add title to PDF
    // Configure the columns to include in the PDF
    var columns = ['SNo', 'Student Name', 'RegisterNo.', 'Phone', 'Email'];
    // Extract the table data from the HTML table
    var data = [];
    var tableRows = document.querySelectorAll('#stdDetails tbody tr');
    tableRows.forEach(function (row, index) {
      var rowData = [];
      rowData.push(index + 1);
      rowData.push(row.querySelector('td:nth-child(2)').textContent.trim());
      rowData.push(row.querySelector('td:nth-child(3)').textContent.trim());
      rowData.push(row.querySelector('td:nth-child(4)').textContent.trim());
      rowData.push(row.querySelector('td:nth-child(5)').textContent.trim());
    //   rowData.push(row.querySelector('td:nth-child(5)').textContent.trim());
      data.push(rowData);
    });
    // Add the modified table to the PDF
    doc.autoTable({
      head: [columns],
      body: data,
      theme: 'grid',
      font: 'courier',
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 60 },
        2: { cellWidth: 60 },
        3: { cellWidth: 60 },
        4: { cellWidth: 60 },
        5: { cellWidth: 60 },

      }
    });
    // Save the PDF
    doc.save(pageTitle+'.pdf');
  }

  // DataTable js
  $(document).ready(function () {
    $('#stdDetails').DataTable();
});
$(document).ready(function () {
  $('#staffDetails').DataTable();
});

