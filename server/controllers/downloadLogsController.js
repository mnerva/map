export const downloadLogFile = async (req, res) => {
  const auth = req.headers.authorization || '';
  const expected = 'Basic ' + Buffer.from(`${process.env.LOGS_AUTH_USER}:${process.env.LOGS_AUTH_PASS}`).toString('base64');

  if (auth !== expected) {
    res.set('WWW-Authenticate', 'Basic realm="Logs"');
    return res.status(401).send('Unauthorized');
  }

  const { filename } = req.params;
  const filePath = path.join('/tmp/filtered-logs', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found.');
  }

  res.download(filePath, filename);
};
