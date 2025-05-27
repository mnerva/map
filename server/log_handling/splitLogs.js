import fs from 'fs';
import path from 'path';

export default function splitLogsByDate(logFilePath, outputDir) {
  // Check if the source log file exists
  if (!fs.existsSync(logFilePath)) {
    console.error("Log file does not exist:", logFilePath);
    return null;
  }

  // Check if the output directory exists
  if (!fs.existsSync(outputDir)) {
    console.error("Output directory does not exist:", outputDir);
    return null;
  };

  const data = fs.readFileSync(logFilePath, "utf8");

  // Check if the log file is empty
  if (!data.trim()) {
    console.warn("Log file is empty:", logFilePath);
    return null;
  }

  const lines = data.split("\n");

  const files = new Map();

  for (const line of lines) {
    const match = line.match(/\[(\d{2})\/(\w{3})\/(\d{4})/);
    // Skip lines without a valid date
    if (!match) continue;

    const [_, day, month, year] = match;
    // Format the date as dd-Mon-yyyy to use as filename
    const dateKey = `${day}-${month}-${year}`;

    // If this date hasn't been before, create a new write stream for it
    if (!files.has(dateKey)) {
      const filePath = path.join(outputDir, `${dateKey}.log`);
      files.set(dateKey, fs.createWriteStream(filePath));
    }

    files.get(dateKey).write(line + "\n");
  }

  files.forEach(stream => stream.end());
  return [...files.keys()];
}
