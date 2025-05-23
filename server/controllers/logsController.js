export const downloadLogs = async (req, res) => {

  const auth = req.headers.authorization || '';
  const expected = 'Basic ' + Buffer.from(`${process.env.LOGS_AUTH_USER}:${process.env.LOGS_AUTH_PASS}`).toString('base64');

  if (auth !== expected) {
    res.set('WWW-Authenticate', 'Basic realm="Logs"');
    return res.status(401).send('Unauthorized');
  }

  // Full path to your log file
  const logFilePath = '/tmp/access.log';

  res.download(logFilePath, 'access.log', (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error downloading log file');
    }
  });
};