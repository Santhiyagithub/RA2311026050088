require('dotenv').config();
const express = require('express');
const cors = require('cors');
const schedulerRoutes = require('./routes/schedulerRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', schedulerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vehicle Maintenance Scheduler API running on port ${PORT}`);
  console.log(`Test Endpoint: curl http://localhost:${PORT}/api/schedule`);
});
