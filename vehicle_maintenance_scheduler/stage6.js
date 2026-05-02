require('dotenv').config();
const { fetchTopNotifications } = require('./services/notificationService');

async function main() {
  try {
    const top10 = await fetchTopNotifications();
    console.log("Top 10 Priority Notifications:");
    console.log(JSON.stringify(top10, null, 2));
  } catch (error) {
    console.error(error.message);
  }
}

main();
