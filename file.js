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
      if (
        confirm(
          "phone_number column doesn't exists. please upload a valid xls. Would you like to download XLS sample?"
        )
      ) {
        document.getElementById("xls-sample").click();
      }
    } else {
      // add new header
      headerRow.push("Sim_Name");
      const dataRows = XLSX.utils.sheet_to_json(sheet, {
        header: phoneNumberIndex,
      });

      // Modify the data rows to set "sim name" based on "phone_number"
      dataRows.forEach((row) => {
        const phoneNumber = row["phone_number"]; // Assuming the column name is
        const simName = getSimNameBasedOnPhoneNumber(phoneNumber); // Modify this function as needed
        row["Sim_Name"] = simName;
        // console.log("Sim_Name", row);
      });

      renderTable(headerRow, dataRows);
      exportToXLSX(headerRow, dataRows, fileName);
    }
  };

  reader.readAsArrayBuffer(file);
};

const csvFilehandle = (file, fileName) => {
  const reader = new FileReader();
  reader.onload = function (event) {
    const contents = event.target.result;

    // Parse the Excel data into a JSON object.
    const workbook = XLSX.read(contents, { type: "binary" });
    const sheetName = workbook.SheetNames[0]; // Assuming you have one sheet.
    const csvData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (csvData[0]?.phone_number == undefined) {
      if (
        confirm(
          "phone_number column doesn't exists. please upload a valid csv. Would you like to download CSV sample?"
        )
      ) {
        document.getElementById("csv-sample").click();
      }
      return;
    }

    headerRow = Object.keys(csvData[0]);
    headerRow.push("Sim_Name");

    dataRows = [...csvData];

    dataRows.forEach((row) => {
      const phoneNumber = row["phone_number"]; // Assuming the column name is
      const simName = getSimNameBasedOnPhoneNumber(phoneNumber);
      row.Sim_Name = simName;
    });

    renderTable(headerRow, dataRows);
    exportToCSV([...dataRows], fileName);
  };

  reader.readAsText(file);
};

const renderTable = (headerRow, dataRows) => {
  const table = document.getElementById("data-table");

  if (table.tHead) table.tHead.querySelector("tr").innerHTML = "";
  if (table.tBodies.length > 0) table.tBodies[0].innerHTML = "";
  document.getElementById("export-button").innerHTML = "";
  // Render table headers
  headerRow.forEach((cellText) => {
    const th = document.createElement("th");
    th.innerHTML = cellText;
    table.tHead.querySelector("tr").appendChild(th);
  });

  dataRows.forEach((row) => {
    const tr = document.createElement("tr");

    for (const key in row) {
      const cellValue = row[key];
      const td = document.createElement("td");
      if (key === "Sim_Name") {
        td.innerHTML = renderSimCard(cellValue);
        tr.appendChild(td);
      } else {
        td.textContent = cellValue;
        tr.appendChild(td);
      }
    }
    table.tBodies[0].appendChild(tr);
  });

  table.scrollIntoView({ behavior: "smooth", block: "center" });
};

// // Function to determine "sim name" based on "phone_number"
function getSimNameBasedOnPhoneNumber(phoneNumber) {
  let value = phoneNumber.toString().replaceAll("-", "").slice(0, 3);
  if (
    value.match(ntc1) ||
    value.match(ntc2) ||
    value.match(ntc3) ||
    value.match(ntc4)
  ) {
    return "NTC";
  } else if (value.match(ncell)) {
    return "NCELL";
  } else if (value.match(smart)) {
    return "SMART";
  } else {
    return "NA";
  }
}

// make update excel downloadable
function exportToXLSX(headerRow, dataRows, fileName) {
  let dataRowsArray = dataRows.map((rows) => {
    let newArr = [];
    for (const key in rows) {
      newArr.push(rows[key]);
    }
    return newArr;
  });

  const data = [headerRow, ...dataRowsArray];
  const wb = XLSX.utils.book_new();
  // Create a worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Generate the XLSX file as a blob
  const wBout = XLSX.write(wb, { type: "array", bookType: "xls" });

  const url = window.URL.createObjectURL(
    new Blob([wBout], { type: "application/octet-stream" })
  );

  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName.split(".")[0]}-from-ncell-or-ntc.xls`;
  a.innerText = "Export xls";
  document.getElementById("export-button").appendChild(a);
}

function exportToCSV(data, fileName) {
  console.log("data", data);
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const wBout = XLSX.write(wb, { bookType: "csv", type: "array" });
  const blob = new Blob([wBout], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName.split(".")[0]}-from-ncell-or-ntc.csv`;
  a.innerText = "Export CSV";
  document.getElementById("export-button").appendChild(a);
}

const renderSimCard = (value) => {
  if (value == "NCELL") {
    return `
    <div class="sim-tag">
    <div class="img-box">
      <img src="./images/ncell.png" alt="ncell ot ntc">
    </div> <span>NCELL</span>
  </div>
    `;
  } else if (value == "NTC") {
    return `
    <div class="sim-tag">
    <div class="img-box">
      <img src="./images/ntc.png" alt="ncell ot ntc">
    </div> <span>NTC</span>
  </div>
    `;
  } else {
    return `
    <div class="sim-tag">
    <div class="img-box">
      <img src="./images/not-found.png" alt="ncell ot ntc">
    </div> <span>NA</span>
  </div>
    `;
  }
};
