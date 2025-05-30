import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, '..', 'log_handling', 'logs');
const scriptPath = path.join(__dirname, '..', 'log_handling', 'handleLogs.sh');

console.log("Logs Directory:", logsDir);
console.log("Script Path:", scriptPath);

// Controller to run the bash script
export function splitLogsHandler(req, res) {
  execFile(scriptPath, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return res.status(500).send('Failed to split logs');
    }

    if (stderr) {
      console.error(`Script stderr: ${stderr}`);
    }

    console.log(`Script output:\n${stdout}`);
    res.status(200).send('Logs split successfully');
  });
}

export function listLogFiles(req, res) {
  fs.readdir(logsDir, (err, files) => {
    if (err) {
      console.error(`Error reading logs directory: ${err.message}`);
      return res.status(500).json({ message: 'Failed to read logs directory' });
    }

    const logFiles = files.filter(file => file.endsWith('.log'));
    res.json(logFiles);
  });
}

export function downloadLogFile(req, res) {
  const filePath = path.join(logsDir, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json('Log file not found');
  }

  res.download(filePath);
}