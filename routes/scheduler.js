// routes/scheduler.js
const express = require('express');
const router = express.Router();
const ScheduledMessage = require('../models/ScheduledMessage');

router.post('/schedule', async (req, res) => {
  try {
    const { message, day, time } = req.body;

    const scheduledAt = new Date(`${day}T${time}:00`);

    await ScheduledMessage.create({ message, scheduledAt });

    res.json({ status: 'Scheduled', scheduledAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
