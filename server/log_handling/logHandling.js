import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Main function to handle downloading logs and slicing them into separate files by date
export async function handleDownloadAndSlice() {
  const logFilePath = '/tmp/access.log';

  if (!fs.existsSync(logFilePath)) {
    throw new Error('Log file not found');
  }

  try {
    const logData = fs.readFileSync(logFilePath, 'utf-8');

    if (!logData.trim()) {
      throw new Error('Log file is empty');
    }

    const slicedLogs = sliceLogsByDate(logData);
    console.log('Sliced logs by date:', slicedLogs);
    const dates = Object.keys(slicedLogs);
    console.log('Dates found in logs:', dates);

    if (dates.length === 0) {
      throw new Error('No valid log entries found for any date.');
    }

    // Define the local folder to save the sliced log files
    const logsFolder = path.join('/tmp/logs');

    // Create the logs folder if it doesn’t already exist
    try {
      if (!fs.existsSync(logsFolder)) fs.mkdirSync(logsFolder);
    } catch (err) {
      throw new Error(`Failed to create logs folder: ${err.message}`);
    }

    // Check write permission
    try {
      fs.accessSync(logsFolder, fs.constants.W_OK);
      console.log('Logs folder is writable');
    } catch (err) {
      console.error('Logs folder is not writable:', err.message);
    }

    // Write each date group of logs into a separate file
    for (const [date, lines] of Object.entries(slicedLogs)) {
      const filePath = path.join(logsFolder, `access-${date}.log`);
      try {
        fs.writeFileSync(filePath, lines.join('\n'));
        console.log(`Wrote log file: ${filePath} (${lines.length} lines)`);
      } catch (err) {
        console.error(`Failed to write log file for ${date}: ${err.message}`);
      }
    }
  } catch (error) {
    console.error('Error downloading or slicing logs:', error);
    throw error; // Re-throw to handle it in the calling function
  }
}

// Function to slice log data by date
function sliceLogsByDate(logData) {
  try {
    const lines = logData.split('\n');
    // Convert short month names to numeric format
    const monthMap = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
    };

    const result = {};

    for (const line of lines) {
      const match = line.match(/\[(\d{2})\/(\w{3})\/(\d{4})/); // [21/May/2025
      if (!match) continue;

      const [ , day, monthStr, year ] = match;
      const month = monthMap[monthStr];
      const date = `${year}-${month}-${day.padStart(2, '0')}`; // Format: YYYY-MM-DD

      if (!result[date]) result[date] = [];
      result[date].push(line);
    }

    return result;
  } catch (err) {
    console.error('Error slicing logs by date:', err);
    throw err; // Re-throw to handle it in the calling function
  }
}