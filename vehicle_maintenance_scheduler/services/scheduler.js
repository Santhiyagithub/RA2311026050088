/**
 * 0/1 Knapsack algorithm to maximize impact of vehicle maintenance tasks 
 * within the given mechanic hours capacity.
 * 
 * @param {Array} tasks - Array of task objects { TaskID, Duration, Impact }
 * @param {number} maxHours - The mechanic capacity in hours
 * @returns {Object} { selectedTasks: [], totalImpact: number, usedHours: number }
 */
function scheduleTasks(tasks, maxHours) {
  const n = tasks.length;
  // dp[i][w] stores the maximum impact with first i tasks and w hours limit
  const dp = Array(n + 1).fill().map(() => Array(maxHours + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const task = tasks[i - 1];
    const weight = task.Duration;
    const value = task.Impact;

    for (let w = 0; w <= maxHours; w++) {
      if (weight <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weight] + value);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  const totalImpact = dp[n][maxHours];
  let res = totalImpact;
  let w = maxHours;
  const selectedTasks = [];
  let usedHours = 0;

  // Backtrack to find which tasks were selected
  for (let i = n; i > 0 && res > 0; i--) {
    if (res === dp[i - 1][w]) {
      // This task was not included
      continue;
    } else {
      // This task was included
      const task = tasks[i - 1];
      selectedTasks.push(task.TaskID);
      usedHours += task.Duration;
      res -= task.Impact;
      w -= task.Duration;
    }
  }

  // Reverse to maintain the original order loosely, though not strictly required
  selectedTasks.reverse();

  return {
    selectedTasks,
    totalImpact,
    usedHours
  };
}

module.exports = { scheduleTasks };
