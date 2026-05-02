# Notification System Design

## Stage 1 — REST API Design

To provide an efficient real-time notification system, we need RESTful APIs for CRUD operations and a mechanism for real-time delivery.

**Endpoints:**
- `GET /notifications` - Retrieve a paginated list of notifications for the authenticated user.
- `POST /notifications` - Create a new notification (Internal/Admin use).
- `PATCH /notifications/:id/read` - Mark a specific notification as read.
- `PATCH /notifications/read-all` - Mark all notifications as read for the user.
- `DELETE /notifications/:id` - Delete a specific notification.

**JSON Structure (Response):**
```json
{
  "id": "uuid",
  "student_id": 1042,
  "notification_type": "Placement",
  "message": "You have been shortlisted for the final round.",
  "is_read": false,
  "created_at": "2024-05-02T10:00:00Z"
}
```

**Real-time delivery mechanism:**
- Use **Server-Sent Events (SSE)** for unidirectional real-time updates from server to client since notifications are mostly server-to-client.
- Alternatively, **WebSockets** can be used if bidirectional communication (e.g., instant read receipts) is required.

---

## Stage 2 — Database Design

**Database Selection:** PostgreSQL
PostgreSQL is chosen for its strong ACID compliance, support for JSON/JSONB (useful for flexible notification metadata), and excellent indexing capabilities.

**Schema:**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id INT NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Scaling Discussion:**
As the notifications table grows rapidly, we can partition the table by `created_at` (e.g., monthly partitions) to keep index sizes manageable and speed up recent queries. Old notifications can be archived or deleted.

---

## Stage 3 — Query Optimization

**Given Query:**
```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;
```

**Why it is slow:**
Without a proper index, the database engine has to perform a full table scan or use a suboptimal index, filtering out irrelevant rows sequentially. Sorting by `createdAt DESC` also adds significant overhead if not indexed.

**Indexing Strategy:**
We should create a composite index that covers the exact WHERE clause conditions and the ORDER BY clause to allow an index-only scan or an efficient bitmap heap scan.

**Recommended Solution:**
```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt DESC);
```

---

## Stage 4 — Performance Fix

To handle high read throughput and large notification volumes:

1. **Redis Caching:** Cache unread notification counts and recent notifications per user in Redis (`notifications:student_id:1042`). Invalidate or update the cache upon a new notification.
2. **Pagination:** Never fetch all unread notifications at once. Use `LIMIT` and `OFFSET` or cursor-based pagination.
3. **Cursor-based Pagination:** Better than offset pagination for large datasets because it doesn't degrade in performance as the offset grows. Return a `next_cursor` (usually the last `createdAt` timestamp) to fetch the next batch.
4. **Lazy Loading:** Load the first 10-20 notifications on the UI and fetch more as the user scrolls.

---

## Stage 5 — Notify All Problem

**Why the current solution is bad:**
- **Sequential Execution:** Looping through thousands of students sequentially will take a very long time.
- **Slow Email API:** If the external email API takes 500ms per request, 10,000 students = 5,000 seconds (> 1 hour).
- **Failure Midway:** If the script crashes at student 5,000, there is no state tracking. Re-running it will send duplicates to the first 5,000.
- **No Retries:** Transient network errors will cause missed emails without an automatic retry mechanism.

**Better Solution:**
- **Queue System:** Use a message broker like **RabbitMQ** or **Kafka**.
- **Async Workers:** The API simply publishes a "Send Notification" event to the queue and returns a `202 Accepted` response immediately. Multiple worker processes consume the queue concurrently, sending emails in parallel.
- **Retry Queue/Dead Letter Queue (DLQ):** If sending fails, the worker pushes the message to a retry queue with exponential backoff. If it repeatedly fails, it goes to a DLQ for manual inspection.
