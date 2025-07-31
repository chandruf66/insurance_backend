const ScheduledMessage = require('../models/ScheduledMessage');

exports.scheduleMessage = async (req, res) => {
  try {
    const { message, day, time } = req.body;

    const dateStr = `${day} ${time}`; // e.g., "2025-08-01 14:30"
    const scheduleTime = new Date(dateStr);

    const newMessage = await ScheduledMessage.create({ message, scheduleTime });
    res.json({ success: true, data: newMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
