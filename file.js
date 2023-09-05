// Function to handle file selection
function handleFileSelect(event) {
  const fileInput = event.target;
  const files = fileInput.files;

  if (files.length > 0) {
    const file = files[0];
    const fileName = file.name;

    // Check if the file has a valid extension
    if (fileName.endsWith(".xlsx")) {
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

const excelFilehandle = (file, fileName) => {};

const csvFilehandle = (file, fileName) => {};
