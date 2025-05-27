import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Main function to handle downloading logs and slicing them into separate files by date
export async function handleDownloadAndSlice() {
  const url = 'https://map-a363.onrender.com/api/downloadLogs';

  // Get authentication credentials from environment variables
  const username =  process.env.LOGS_AUTH_USER;
  const password =  process.env.LOGS_AUTH_PASS;

  const res = await fetch(url, {
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
    },
  });

  const logData = await res.text();

  const slicedLogs = sliceLogsByDate(logData);

  // Define the local folder to save the sliced log files
  const logsFolder = path.join(__dirname, '../logs');
  // Create the logs folder if it doesn’t already exist
  if (!fs.existsSync(logsFolder)) fs.mkdirSync(logsFolder);

  // Write each date group of logs into a separate file
  for (const [date, lines] of Object.entries(slicedLogs)) {
    const filePath = path.join(logsFolder, `access-${date}.log`);
    fs.writeFileSync(filePath, lines.join('\n'));
  }
}

// Function to slice log data by date
function sliceLogsByDate(logData) {
  const lines = logData.split('\n');
  const result = {};

  for (const line of lines) {
    const match = line.match(/\[(\d{2})\/(\w{3})\/(\d{4})/); // [21/May/2025
    if (!match) continue;

    const [ , day, monthStr, year ] = match;

    // Convert short month names to numeric format
    const monthMap = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
    };

    const month = monthMap[monthStr];
    const date = `${year}-${month}-${day.padStart(2, '0')}`; // Format: YYYY-MM-DD

    if (!result[date]) result[date] = [];
    result[date].push(line);
  }

  return result;
}