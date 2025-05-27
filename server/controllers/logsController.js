import { handleDownloadAndSlice } from '../log_handling/logHandling.js';

export async function downloadLogs(req, res) {
  try {
    await handleDownloadAndSlice();
    res.status(200).json({ message: 'Logs downloaded and sliced successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process logs' });
  }
}
