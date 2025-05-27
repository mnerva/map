import dotenv from 'dotenv';
import fs from "fs";
import path from "path";
import cron from "node-cron";
import splitLogsByDate from "./splitLogs";
import downloadFile from "./downloadSplits";

dotenv.config();

const auth = Buffer.from(`${process.env.LOGS_AUTH_USER}:${process.env.LOGS_AUTH_PASS}`).toString("base64");
const authHeader = `Basic ${auth}`;
// Where the log file is stored on the server
const logFilePath = "/tmp/access.log";
// Temporary directory for split logs on the server
const tempSplitDir = "/tmp/split-logs";
const localDownloadDir = path.join(__dirname, "logs", "downloads");

// Ensure the directories exist
if (!fs.existsSync(tempSplitDir)) fs.mkdirSync(tempSplitDir);
if (!fs.existsSync(localDownloadDir)) fs.mkdirSync(localDownloadDir, { recursive: true });


cron.schedule("*/3 * * * *", async () => {
  // Split the logs on the server
  const dates = splitLogsByDate(logFilePath, tempSplitDir);

  // Check if the split logs were created
  if (dates === null) {
    console.warn("No log file to process.");
    return;
  }

  // Download split logs into local folder
  for (const date of dates) {
    const fileUrl = `https://map-a363.onrender.com/tmp/split-logs/${date}.log`;
    const localFile = path.join(localDownloadDir, `${date}.log`);

    try {
      await downloadFile(fileUrl, localFile, authHeader);
      console.log(`Downloaded: ${localFile}`);
    } catch (err) {
      console.error(err);
    }
  }

  if (fs.existsSync(logFilePath)) {
    // Delete original log file
    fs.unlinkSync(logFilePath);
    console.log("Original log file deleted.");
  }

}).catch(err => {
  console.error("Error in cron job:", err);
})