/**
 * 0/1 Knapsack algorithm
 * maximize impact
 * subject to mechanic hours
 */
function knapsack(tasks, maxHours) {
  const n = tasks.length;
  // dp[i][w] stores the max impact with first i tasks and w hours limit
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

  let res = dp[n][maxHours];
  let w = maxHours;
  const selectedTasks = [];
  let usedHours = 0;

  for (let i = n; i > 0 && res > 0; i--) {
    if (res === dp[i - 1][w]) {
      continue;
    } else {
      const task = tasks[i - 1];
      selectedTasks.push(task.TaskID);
      usedHours += task.Duration;
      res -= task.Impact;
      w -= task.Duration;
    }
  }

  selectedTasks.reverse();

  return {
    selectedTasks,
    totalImpact: dp[n][maxHours],
    usedHours
  };
}

module.exports = { knapsack };
