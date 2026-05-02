# AffordMed Backend Evaluation

## Project Overview
This project contains the complete backend evaluation submission for the AffordMed assessment. It features a scalable Express.js backend with reusable logger middleware, an algorithmic solver for the 0/1 Knapsack problem applied to vehicle maintenance scheduling, and a priority-based sorting logic for the notification system. 

The evaluation includes all required stages up to Stage 6, properly organized into a production-ready folder structure.

## Folder Structure
```text
RA2311026050088/
├── logging_middleware/
│   ├── register.js
│   ├── auth.js
│   ├── log.js
│   ├── package.json
│   ├── .env
├── vehicle_maintenance_scheduler/
│   ├── app.js
│   ├── package.json
│   ├── .env
│   ├── routes/
│   │   └── schedulerRoutes.js
│   ├── services/
│   │   ├── schedulerService.js
│   │   └── notificationService.js
│   ├── utils/
│   │   ├── knapsack.js
│   │   └── prioritySort.js
│   ├── screenshots/
│   │   ├── register-success.txt
│   │   ├── auth-success.txt
│   │   ├── logger-success.txt
│   │   ├── vehicle-output.txt
│   │   ├── stage6-output.txt
│   └── stage6.js
├── notification_system_design.md
├── README.md
├── .gitignore
```

## Setup Instructions
Make sure you have Node.js installed.

1. Navigate to the `logging_middleware` directory:
   ```bash
   cd logging_middleware
   npm install axios dotenv
   ```
2. Navigate to the `vehicle_maintenance_scheduler` directory:
   ```bash
   cd ../vehicle_maintenance_scheduler
   npm install express axios cors dotenv
   ```

## Run Commands

**Step 1: Registration and Authentication**
(Note: You only need to run this if you don't already have `.env` set up with an active token).
```bash
cd logging_middleware
node register.js
node auth.js
```

**Step 2: Start the Scheduler API**
```bash
cd vehicle_maintenance_scheduler
node app.js
```

**Step 3: Run the Priority Inbox Script (Stage 6)**
```bash
cd vehicle_maintenance_scheduler
node stage6.js
```

## API Usage

When `app.js` is running, you can access the scheduler endpoint:

```http
GET http://localhost:3000/api/schedule
```

**Response Example:**
```json
{
  "selectedTasks": ["taskID-1", "taskID-2"],
  "totalImpact": 204,
  "usedHours": 134
}
```

*Every service layer API call automatically utilizes the `log.js` middleware to record metrics to the remote `/logs` server.*
