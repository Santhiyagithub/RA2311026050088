const axios = require('axios');
const { knapsack } = require('../utils/knapsack');
const Log = require('../../logging_middleware/log');

const BASE_URL = 'http://20.207.122.201/evaluation-service';

async function generateSchedule() {
  const token = process.env.ACCESS_TOKEN;
  if (!token) {
    throw new Error("Access token is missing. Please check .env file.");
  }

  try {
    const headers = { Authorization: `Bearer ${token}` };
    
    // Fetch depots
    const depotsResponse = await axios.get(`${BASE_URL}/depots`, { headers });
    await Log('backend', 'info', 'service', 'Fetched depots successfully', token);

    // Fetch vehicles
    const vehiclesResponse = await axios.get(`${BASE_URL}/vehicles`, { headers });
    await Log('backend', 'info', 'service', 'Fetched vehicles successfully', token);

    const depots = depotsResponse.data.depots;
    const vehicles = vehiclesResponse.data.vehicles;

    let maxHours = 20; // fallback
    if (depots && depots.length > 0 && depots[0].MechanicHours) {
      maxHours = depots[0].MechanicHours;
    }

    const result = knapsack(vehicles, maxHours);
    
    await Log('backend', 'info', 'service', 'Computed knapsack schedule successfully', token);

    return result;
  } catch (error) {
    await Log('backend', 'error', 'service', `Scheduler Error: ${error.message}`, token);
    throw error;
  }
}

module.exports = { generateSchedule };
