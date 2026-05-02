require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

async function register() {
  try {
    const response = await axios.post('http://20.207.122.201/evaluation-service/register', {
      email: "student@college.edu",
      name: "Student Name",
      rollNo: "RA221100301001",
      mobileNo: "1234567890",
      githubUsername: "student123",
      accessCode: "ACC123"
    });

    console.log("Registration Successful:");
    console.log(response.data);

    // Save credentials locally for auth
    if (response.data && response.data.clientID) {
      fs.writeFileSync('.env', `CLIENT_ID=${response.data.clientID}\nCLIENT_SECRET=${response.data.clientSecret}\n`);
      console.log("Saved clientID and clientSecret to .env file.");
    }
  } catch (error) {
    console.error("Registration Failed:", error.response ? error.response.data : error.message);
  }
}

register();
