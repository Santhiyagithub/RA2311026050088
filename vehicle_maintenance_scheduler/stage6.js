require('dotenv').config({ path: '../logging_middleware/.env' });
const axios = require('axios');

const BASE_URL = 'http://20.207.122.201/evaluation-service';

function getPriorityWeight(type) {
  switch (type) {
    case 'Placement':
      return 3;
    case 'Result':
      return 2;
    case 'Event':
      return 1;
    default:
      return 0;
  }
}

async function fetchAndSortNotifications() {
  try {
    const token = process.env.ACCESS_TOKEN;
    if (!token) {
      console.error("Access token is missing. Run auth.js first.");
      return;
    }

    const response = await axios.get(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const notifications = response.data;

    // Sort by weight (descending) and then recency (createdAt descending)
    notifications.sort((a, b) => {
      const weightA = getPriorityWeight(a.notification_type);
      const weightB = getPriorityWeight(b.notification_type);

      if (weightA !== weightB) {
        return weightB - weightA; // Higher weight first
      }

      // If weights are equal, sort by recency (assuming ISO 8601 string)
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return timeB - timeA; // Newer first
    });

    // Return Top 10
    const top10 = notifications.slice(0, 10);

    console.log("Top 10 Priority Notifications:");
    console.log(JSON.stringify(top10, null, 2));

  } catch (error) {
    console.error("Stage 6 Error:", error.response ? error.response.data : error.message);
  }
}

fetchAndSortNotifications();
