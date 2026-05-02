const axios = require('axios');

async function Log(stack, level, packageName, message, token) {
  try {
    const response = await axios.post(
      'http://20.207.122.201/evaluation-service/logs',
      {
        stack,
        level,
        package: packageName,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Logger Error:", error.response ? error.response.data : error.message);
  }
}

module.exports = Log;
