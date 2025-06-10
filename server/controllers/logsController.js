import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, '../log_handling/logs');
const scriptPath = path.join(__dirname, '../log_handling/handleLogs.sh');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Controller to run the bash script
export function splitLogsHandler(req, res) {
  // Check if the script file exists
  if (!fs.existsSync(scriptPath)) {
    return res.status(500).send('Script not found');
  }

  // Check if the script is executable
  fs.access(scriptPath, fs.constants.X_OK, (err) => {
    if (err) {
      return res.status(500).send('Script is not executable');
    }

    execFile(scriptPath, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).send('Failed to split logs');
      }

      if (stderr) {
        console.error(`Script stderr: ${stderr}`);
      }

      res.status(200).send('Logs split successfully');
    });
  })
}

export function listLogFiles(req, res) {
  fs.readdir(logsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to read logs directory' });
    }

    const logFiles = files.filter(file => file.endsWith('.log'));
    res.json(logFiles);
  });
}

export function downloadLogFile(req, res) {
  const filePath = path.join(logsDir, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Log file not found' });
  }

  res.download(filePath);
}