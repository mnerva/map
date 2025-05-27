import fs from "fs";
import https from "https";

export function downloadFile(fileUrl, localPath, authHeader) {
  return new Promise((resolve, reject) => {
    // Make HTTPS GET request with Authorization header
    const req = https.get(fileUrl, { headers: { Authorization: authHeader } }, res => {
      if (res.statusCode !== 200) {
        return reject(`Failed to download ${fileUrl}: ${res.statusCode}`);
      }

      const stream = fs.createWriteStream(localPath);
      res.pipe(stream);
      stream.on("finish", () => {
        stream.close();
        resolve();
      });
    });

    req.on("error", reject);
  });
}

module.exports = downloadFile;
