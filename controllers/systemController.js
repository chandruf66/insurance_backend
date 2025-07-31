const { Worker } = require('worker_threads');
const os = require('os');
const path = require('path');

let restarted = false;

// Upload & process Excel/CSV file in a separate thread
exports.uploadData = (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.resolve(req.file.path);
  const worker = new Worker(path.join(__dirname, '../workers/dataUploader.js'), {
    workerData: { filePath },
  });

  // Listen for message from worker
  worker.on('message', (msg) => {
    res.json({ message: 'Upload processed successfully', data: msg });
  });

  // Handle worker error
  worker.on('error', (err) => {
    console.error('Worker error:', err);
    res.status(500).json({ error: err.message });
  });

  // Exit code (optional logging)
  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
  });
};

// Schedule a message (mock implementation)
exports.scheduleMessage = async (req, res) => {
  const { message, day, time } = req.body;

  // You can add DB logic here to store the scheduled message
  res.json({ status: 'Message scheduled successfully', message, day, time });
};

// Monitor CPU usage and auto-restart if high
exports.monitorCPU = () => {
  setInterval(() => {
    const usage = os.loadavg()[0]; // 1-minute load average
    const cpuCount = os.cpus().length;
    const percent = (usage / cpuCount) * 100;

    if (percent > 70 && !restarted) {
      console.log(`⚠️  High CPU load (${percent.toFixed(2)}%). Restarting...`);
      restarted = true;
      process.exit(1); // Will restart if using PM2 or systemd
    }
  }, 5000); // Check every 5 seconds
};
