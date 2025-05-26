import fs from 'fs';
import path from 'path';
import readline from 'readline';

export const downloadLogs = async (req, res) => {
  // Check for basic authentication
  const auth = req.headers.authorization || '';
  const expected = 'Basic ' + Buffer.from(`${process.env.LOGS_AUTH_USER}:${process.env.LOGS_AUTH_PASS}`).toString('base64');

  // Check if the incoming request is authorized, if not, return
  if (auth !== expected) {
    res.set('WWW-Authenticate', 'Basic realm="Logs"');
    return res.status(401).send('Unauthorized');
  }

  // Path to the log file
  const logFilePath = '/tmp/access.log';
  const outputDir = '/tmp/filtered-logs';

  // If the log file does not exist, return a 404 error
  if (!fs.existsSync(logFilePath)) {
    return res.status(404).send('Log file not found');
  }

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(logFilePath),
    crlfDelay: Infinity
  });

  // Keeps track of open write streams for each log date (e.g. '21-10-2025') to avoid reopening files repeatedly
  const dateStreams = new Map();

  // Extract logs by date
  rl.on('line', (line) => {
    const match = line.match(/\[(\d{2})\/(\w{3})\/(\d{4})/); // [26/May/2025
    if (!match) return;
    
    const [_, day, monStr, year] = match;
    const monthMap = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
    };
    const month = monthMap[monStr];

    const dateStr = `${day}-${month}-${year}`; // as 26-05-2025
    const outPath = path.join(outputDir, `access-${dateStr}.log`);

    if (!dateStreams.has(dateStr)) {
      dateStreams.set(dateStr, fs.createWriteStream(outPath, { flags: 'a' }));
    }

    dateStreams.get(dateStr).write(line + '\n');
  });

  rl.on('close', () => {
    // Close all streams
    for (const stream of dateStreams.values()) {
      stream.end();
    }

    // Delete original log file
    fs.unlinkSync(logFilePath);

    // Respond with a list of available split log filenames
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.log'));
    res.json({ files });
  });
};

export const deleteLogFile = async (req, res) => {
  const auth = req.headers.authorization || '';
  const expected = 'Basic ' + Buffer.from(`${process.env.LOGS_AUTH_USER}:${process.env.LOGS_AUTH_PASS}`).toString('base64');

  if (auth !== expected) {
    res.set('WWW-Authenticate', 'Basic realm="Logs"');
    return res.status(401).send('Unauthorized');
  }

  const logFilePath = '/tmp/access.log';

  fs.unlink(logFilePath, (err) => {
    if (err) {
      console.error('Failed to delete raw log file:', err);
      return res.status(500).send('Error deleting log file');
    }
    console.log('Raw log file deleted');
    res.status(200).send({ message: 'Raw log file deleted successfully' });
  });
}