import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Main function to handle downloading logs and slicing them into separate files by date
export async function handleDownloadAndSlice() {
  const logFilePath = '/tmp/access.log';
  // Local folder to store downloaded files
  const localLogFilePath = path.join(__dirname, 'logs');
  const username =  process.env.LOGS_AUTH_USER;
  const password =  process.env.LOGS_AUTH_PASS;
  const logsFolder = process.env.LOGS_FOLDER;

  if (!fs.existsSync(logFilePath)) {
    throw new Error('Log file not found');
  }

  try {
    // Right now in memory but could be optimized to stream
    const logData = fs.readFileSync(logFilePath, 'utf-8');

    if (!logData.trim()) {
      throw new Error('Log file is empty');
    }

    const slicedLogs = sliceLogsByDate(logData);
    const dates = Object.keys(slicedLogs);

    if (dates.length === 0) {
      throw new Error('No valid log entries found for any date.');
    }

    // Create the logs folder if it doesn’t already exist
    try {
      if (!fs.existsSync(logsFolder)) fs.mkdirSync(logsFolder, { recursive: true });;
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
        fs.promises.writeFile(filePath, lines.join('\n'));
        console.log(`Wrote log file: ${filePath} (${lines.length} lines)`);
      } catch (err) {
        console.error(`Failed to write log file for ${date}: ${err.message}`);
      }
    }

    // Fetch sliced log files from the server
    // Using external fetch so in the future would be easier to switch to a different server
    const res = await fetch('https://map-a363.onrender.com/api/slicedLogFiles', {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch sliced log files: ${res.statusText}`);
    }

    const files = await res.json();
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error('No log files found on server.');
    }
    console.log(`Found ${files.length} log files:`, files);

    // Ensure the local log file path exists
    if (!fs.existsSync(localLogFilePath)) {
      fs.mkdirSync(localLogFilePath, { recursive: true });
      console.log(`Created local folder ${localLogFilePath}`);
    }

    for (const filename of files) {
      const downloadUrl = `https://map-a363.onrender.com/api/slicedLogFiles/${filename}`;
      const localPath = path.join(localLogFilePath, filename);

      try {
        const fileRes = await fetch(downloadUrl);
        if (!fileRes.ok) {
          console.error(`Failed to download ${filename}: ${fileRes.status} ${fileRes.statusText}`);
          return;
        }
      } catch (err) {
          console.error(`Failed to download ${filename}: ${err.message}`);
      }

      try {
        await streamPipeline(fileRes.body, fs.createWriteStream(localPath));
        console.log(`Downloaded ${filename} to ${localPath}`);
      } catch (err) {
        console.error(`Failed to save ${filename}: ${err.message}`);
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

export async function listLogFiles(logsFolder) {
  try {
    const files = await fs.promises.readdir(logsFolder);
    console.log('Log files found in listLogFiles:', files);
    return files;
  } catch (err) {
    throw new Error('Failed to list log files');
  }
}

export async function sendLogFile(req, res) {
  const logsFolder = process.env.LOGS_FOLDER;
  try {
    const { filename } = req.params;
    console.log('Requested filename:', filename);

    // Validate filename
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ message: 'Invalid filename' });
    }

    const filePath = path.join(logsFolder, filename);
    console.log('filePath:', filePath);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Log file not found' });
    }

    // Stream/download the file
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error sending log file:', err.message);
        res.status(500).json({ message: 'Failed to download log file' });
      } else {
        console.log(`Log file sent: ${filename}`);
      }
    });
  } catch (err) {
    console.error('Error in sendLogFile:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}