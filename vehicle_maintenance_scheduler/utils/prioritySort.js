/**
 * Sort notifications based on priority and recency.
 * Priority: Placement (3) > Result (2) > Event (1)
 */

function getPriorityWeight(type) {
  switch (type) {
    case 'Placement': return 3;
    case 'Result': return 2;
    case 'Event': return 1;
    default: return 0;
  }
}

function sortNotifications(notifications) {
  return notifications.sort((a, b) => {
    const weightA = getPriorityWeight(a.Type);
    const weightB = getPriorityWeight(b.Type);

    if (weightA !== weightB) {
      return weightB - weightA; // Higher weight first
    }

    const timeA = new Date(a.Timestamp).getTime();
    const timeB = new Date(b.Timestamp).getTime();
    return timeB - timeA; // Newer first
  });
}

module.exports = { sortNotifications };
