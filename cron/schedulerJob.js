// cron/schedulerJob.js
const cron = require('node-cron');
const ScheduledMessage = require('../models/ScheduledMessage');
const Message = require('../models/Message');

cron.schedule('* * * * *', async () => {
  const now = new Date();

  const dueMessages = await ScheduledMessage.find({
    scheduleTime: { $lte: now }
  });

  for (const item of dueMessages) {
    await Message.create({ message: item.message });
    await ScheduledMessage.deleteOne({ _id: item._id });
    console.log(`Inserted scheduled message: ${item.message}`);
  }
});
