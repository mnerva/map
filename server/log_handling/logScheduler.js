import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

// Schedule every 3 minutes
setInterval(async () => {
  try {
    console.log(`[${new Date().toISOString()}] Calling /downloadLogs endpoint`);

    const username =  process.env.LOGS_AUTH_USER;
    const password =  process.env.LOGS_AUTH_PASS;
    
    const res = await fetch('https://map-a363.onrender.com/api/downloadLogs', {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
      },
    });
    console.log('res', res)
    
    const data = await res.text();
    console.log('Response data:', data);
    
  } catch (err) {
    console.error('Error calling /downloadLogs:', err);
  }
}, 3 * 60 * 1000);
