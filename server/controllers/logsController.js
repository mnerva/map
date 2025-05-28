import { handleDownloadAndSlice, listLogFiles, sendLogFile } from '../log_handling/logHandling.js';
import fs from 'fs';

export async function downloadLogs(req, res) {
  try {
    await handleDownloadAndSlice();
    res.status(200).json({ message: 'Logs downloaded and sliced successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to process logs' });
  }
}

export async function slicedLogs(req, res) {
  const logsFolder = process.env.LOGS_FOLDER;
  try {
    const files = await listLogFiles(logsFolder);
    res.status(200).json(files);
  } catch (err) {
    console.error('Error listing log files:', err.message);
    res.status(500).json('Failed to list log files');
  }
}

export async function downloadLogFile(req, res) {
  try {
    await sendLogFile(req, res);
  } catch (err) {
    console.error('Error downloading log file:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}