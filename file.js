// Function to handle file selection
function handleFileSelect(event) {
  const fileInput = event.target;
  const files = fileInput.files;
  if (files.length > 0) {
    const file = files[0];
    const fileName = file.name;
    // Check if the file has a valid extension
    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      excelFilehandle(file, fileName);
    } else if (fileName.endsWith(".csv")) {
      csvFilehandle(file, fileName);
    } else {
      alert(`File ${fileName} is not a valid Excel or CSV file.`);
    }
  }
}

// Attach event listeners to file input elements
const fileInput = document.getElementById("file-input");
fileInput.addEventListener("change", handleFileSelect);

const excelFilehandle = (file, fileName) => {
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Assuming the first sheet contains the data
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Check if the sheet has a 'phone_number' column
    const headerRow = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];

    const phoneNumberIndex = headerRow.findIndex(
      (cell) => cell === "phone_number"
    );

    // not found phone number
    if (phoneNumberIndex == -1) {
      alert(
        "phone_number column doesn't exists. please upload a valid excel. you can download same from example"
      );
    } else {
      const dataRows = XLSX.utils.sheet_to_json(sheet, {
        header: phoneNumberIndex,
      });
      renderTable(headerRow, dataRows, fileName);
    }
  };

  reader.readAsArrayBuffer(file);
};

const csvFilehandle = (file, fileName) => {};

const renderTable = (headerRow, dataRows, fileName) => {
  const table = document.getElementById("data-table");

  if (table.tHead) table.tHead.querySelector("tr").innerHTML = "";
  if (table.tBodies.length > 0) table.tBodies[0].innerHTML = "";

  // Render table headers
  headerRow.forEach((cellText) => {
    const th = document.createElement("th");
    th.innerHTML = cellText;
    console.log("th", th);
    table.tHead.querySelector("tr").appendChild(th);
  });

  dataRows.forEach((row) => {
    const tr = document.createElement("tr");
    Object.values(row).forEach((cellValue) => {
      const td = document.createElement("td");
      td.textContent = cellValue;
      tr.appendChild(td);
    });
    table.tBodies[0].appendChild(tr);
  });
};
