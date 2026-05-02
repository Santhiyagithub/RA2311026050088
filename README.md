# AffordMed Backend Evaluation

This repository contains the completed AffordMed Backend Evaluation.

## Structure

*   `logging_middleware/`: Reusable logger and authentication scripts.
*   `vehicle_maintenance_scheduler/`: Express app solving the 0/1 Knapsack problem for vehicle maintenance and Stage 6 Priority Notifications.
*   `notification_system_design.md`: Markdown document detailing system design for stages 1-5.
*   `screenshots/`: Outputs from all executed APIs and scripts.

## Installation

```bash
cd logging_middleware
npm install
cd ../vehicle_maintenance_scheduler
npm install
```

## Running the Scheduler

```bash
cd vehicle_maintenance_scheduler
node app.js
```

## Running the Priority Notifications

```bash
cd vehicle_maintenance_scheduler
node stage6.js
```
