import fetch from 'node-fetch';

// Schedule every 3 minutes
setInterval(async () => {
  try {
    console.log(`[${new Date().toISOString()}] Calling /downloadLogs endpoint`);
    
    const res = await fetch('https://map-a363.onrender.com/api/downloadLogs');
    
    const data = await res.json();
    console.log('Response:', data);
    
  } catch (err) {
    console.error('Error calling /downloadLogs:', err);
  }
}, 3 * 60 * 1000);
