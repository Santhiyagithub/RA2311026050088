const express = require('express');
const router = express.Router();
const { generateSchedule } = require('../services/schedulerService');

router.get('/schedule', async (req, res) => {
  try {
    const result = await generateSchedule();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
