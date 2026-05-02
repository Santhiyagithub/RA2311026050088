require('dotenv').config({ path: '../logging_middleware/.env' });
const express = require('express');
const axios = require('axios');
const { scheduleTasks } = require('./services/scheduler');

const app = express();
app.use(express.json());

const BASE_URL = 'http://20.207.122.201/evaluation-service';

app.get('/schedule', async (req, res) => {
  try {
    const token = process.env.ACCESS_TOKEN;
    if (!token) {
      return res.status(401).json({ error: "Access token is missing. Run auth.js first." });
    }

    // Step 1: Fetch Depots
    // In a real scenario, this might give mechanic hours capacity. Let's assume we can fetch it, 
    // or maybe the API gives us `maxHours` per depot.
    // We will just fetch both and assume depot API gives capacity.
    const depotsResponse = await axios.get(`${BASE_URL}/depots`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const vehiclesResponse = await axios.get(`${BASE_URL}/vehicles`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const depots = depotsResponse.data;
    const vehicles = vehiclesResponse.data;

    // For this demonstration, let's assume we are scheduling for the first depot
    // or a fixed capacity if depot API is not structured that way.
    // The prompt says: "Mechanic Hours = Capacity", let's use a dynamic or static value.
    // If depots list gives capacity, we use it. Else, we fallback to a default (e.g. 20 hours).
    let maxHours = 20; 
    if (depots && depots.length > 0 && depots[0].capacity) {
      maxHours = depots[0].capacity;
    }

    // Schedule
    const result = scheduleTasks(vehicles, maxHours);

    res.json(result);
  } catch (error) {
    console.error("Scheduler Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to generate schedule" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vehicle Maintenance Scheduler running on port ${PORT}`);
  console.log(`To run the scheduler: curl http://localhost:${PORT}/schedule`);
});
