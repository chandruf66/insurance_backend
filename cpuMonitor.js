const os = require('os');
const { exec } = require('child_process');

// Check CPU every 10 seconds
setInterval(() => {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;

  cpus.forEach((core) => {
    for (const type in core.times) {
      total += core.times[type];
    }
    idle += core.times.idle;
  });

  const idlePercent = idle / total;
  const usagePercent = 100 - idlePercent * 100;

  console.log(`CPU Usage: ${usagePercent.toFixed(2)}%`);

  if (usagePercent > 70) {
    console.log('⚠️ CPU Usage too high. Restarting server...');
    exec('nodemon server', (err, stdout, stderr) => {
      if (err) {
        console.error('Failed to restart:', stderr);
      } else {
        console.log('Server restarted via PM2');
      }
    });
  }
}, 10000);
