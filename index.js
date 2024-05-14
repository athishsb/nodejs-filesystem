// Importing required packages
import express from 'express';
import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';

// Creating an Express server instance
const app = express();
const PORT = 3000;

// Directory to store the timestamp files
const DIRECTORY = './TimeStamp';

// Ensure the directory exists
if (!fs.existsSync(DIRECTORY)) {
  fs.mkdirSync(DIRECTORY, { recursive: true });
}

// Function to get the formatted date and time in a specific time zone
const getFormattedDateTime = (timeZone) => {
  return moment().tz(timeZone).format('DD-MM-YYYY-HH-mm-ss');
};

const getFormattedTimeStamp = (timeZone) => {
  return moment().tz(timeZone).format('HH:mm:ss');
};

// Showing home page
app.get('/', (req, res) => {
  res.status(200).send(`
    <h1 style="background-color:skyblue;padding:10px 0;text-align:center">Express Server is Connected!</h1>
    <div style="text-align:center">
      <p><span style="background-color:lightgreen;font-size:18px">To Create a New txt file</span> --> <a href="/create-file">Click Here</a></p>
      <p><span style="background-color:yellow;font-size:18px">To Retrieve all txt files</span> --> <a href="/get-files">Click Here</a></p>
    </div>
  `);
});

// Creating a new timestamp file
app.get('/create-file', (req, res) => {
  try {
    const timeZone = 'Asia/Kolkata'; // Use the IST time zone
    const filename = getFormattedDateTime(timeZone);
    const timestamp = getFormattedTimeStamp(timeZone);

    // File path and content
    const filePath = path.join(DIRECTORY, `${filename}.txt`);
    const content = `Current Timestamp: ${timestamp}`;

    // Writing the content to the file
    fs.writeFileSync(filePath, content, 'utf8');

    // Sending response status and display data
    res.status(200).send(`
      <h1 style="background-color:green;padding:10px 0;text-align:center;color:white">File created successfully!</h1>
      <div style="text-align:center">
        <p>File Name: ${filename}.txt</p>
        <p>File Content: ${content}</p>
        <p><a href="/" style="color:orange">Back to Home</a></p>
      </div>
    `);
  } catch (err) {
    // Handling errors
    res.status(500).send(`
      <h1 style="background-color:red;padding:10px 0;text-align:center;color:white">Something went wrong!</h1>
      <div style="text-align:center">
        <p><a href="/" style="color:orange">Back to Home</a></p>
      </div>
    `);
  }
});

// Retrieving all timestamp files
app.get('/get-files', (req, res) => {
  try {
    // Reading all files in the directory
    const files = fs.readdirSync(DIRECTORY);

    // Filtering only .txt files
    const txtFiles = files.filter(file => file.endsWith('.txt'));

    // Generating the list of files with content
    const fileDetails = txtFiles.map(file => {
      const content = fs.readFileSync(path.join(DIRECTORY, file), 'utf8');
      return `
        <dl style="display:list-item;list-style-type:disc;">
          <dt><b>File Name:</b> ${file}</dt>
          <dd style="display:list-item;list-style-type:circle;">
            <b>File Content:</b> ${content}
          </dd>
        </dl>`;
    }).join('');

    // Sending response status and display data
    res.status(200).send(`
      <h1 style="background-color:green;padding:10px 0;text-align:center;color:white">All retrieved txt files</h1>
      <div style="text-align:center">
        ${fileDetails}
        <p><a href="/" style="color:orange">Back to Home</a></p>
      </div>
    `);
  } catch (err) {
    // Handling errors
    res.status(500).send(`
      <h1 style="background-color:red;padding:10px 0;text-align:center;color:white">Error reading files: ${err.message}</h1>
      <div style="text-align:center">
        <p><a href="/" style="color:orange">Back to Home</a></p>
      </div>
    `);
  }
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
