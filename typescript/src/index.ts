import axios from "axios";
import * as fs from "fs";

// Function to print the structure of the JSON and write it to a file
const printFormatToFile = (
  data: any,
  indent: string = "",
  fileStream?: fs.WriteStream
): void => {
  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data)) {
      fileStream?.write(`${indent}Array [\n`);
      if (data.length > 0) {
        printFormatToFile(data[0], indent + "  ", fileStream);
      }
      fileStream?.write(`${indent}]\n`);
    } else {
      fileStream?.write(`${indent}{\n`);
      for (const key in data) {
        fileStream?.write(`${indent}  ${key}:\n`);
        printFormatToFile(data[key], indent + "    ", fileStream);
      }
      fileStream?.write(`${indent}}\n`);
    }
  } else {
    fileStream?.write(`${indent}${typeof data}\n`);
  }
};

async function fetchAndPrintJSONFormatToFile(
  url: string,
  filePath: string
): Promise<void> {
  try {
    // Fetch the data from the URL
    const response = await axios.get(url);

    // Extract the JSON data
    const data = response.data;

    // Create a write stream for the file
    const fileStream = fs.createWriteStream(filePath);

    // Write the format of the JSON data to the file
    printFormatToFile(data, "", fileStream);

    // Close the file stream
    fileStream.end();

    console.log(`Data format written to ${filePath}`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Example usage
fetchAndPrintJSONFormatToFile(
  "https://backend.takeuforward.org/api/sheets/double/strivers_a2z_sheet",
  "dataFormat.txt"
);
