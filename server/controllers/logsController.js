export const downloadLogs = async (req, res) => {
  console.log('Download controller hit');
  
  // Full path to your log file
  const logFilePath = '/tmp/access.log';

  res.download(logFilePath, 'access.log', (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error downloading log file');
    }
  });
};
