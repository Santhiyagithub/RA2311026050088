const axios = require('axios');
const { sortNotifications } = require('../utils/prioritySort');
const Log = require('../../logging_middleware/log');

const BASE_URL = 'http://20.207.122.201/evaluation-service';

async function fetchTopNotifications() {
  const token = process.env.ACCESS_TOKEN;
  if (!token) {
    throw new Error("Access token is missing.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    await Log('backend', 'info', 'service', 'Fetched notifications successfully', token);

    const sorted = sortNotifications(response.data.notifications);
    const top10 = sorted.slice(0, 10);
    
    await Log('backend', 'info', 'service', 'Sorted notifications successfully', token);

    return top10;
  } catch (error) {
    await Log('backend', 'error', 'service', `Notification Error: ${error.message}`, token);
    throw error;
  }
}

module.exports = { fetchTopNotifications };
