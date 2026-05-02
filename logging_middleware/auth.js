require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

async function authenticate() {
  try {
    const response = await axios.post('http://20.207.122.201/evaluation-service/auth', {
      email: "student@college.edu",
      name: "Student Name",
      rollNo: "RA2311026050088",
      accessCode: "QkbpxH",
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    });

    console.log("Authentication Successful:");
    console.log(response.data);

    if (response.data && response.data.access_token) {
      // Append access token to .env
      fs.appendFileSync('.env', `ACCESS_TOKEN=${response.data.access_token}\n`);
      console.log("Saved access_token to .env file.");
    }
  } catch (error) {
    console.error("Authentication Failed:", error.response ? error.response.data : error.message);
  }
}

authenticate();
