# Database Design Validation (MongoDB)

This section validates the provided MongoDB schema and offers suggestions for improvement and further considerations.

## Provided Schema Review:

### User:
```javascript
{
  _id,
  name,
  email,
  passwordHash,
  role: "user" | "admin" | "worker",
  phone,
  location: { lat, lng }
}
```
*   **Validation:** Good. Captures essential user information and roles. `passwordHash` is correctly used for security. `location` for users could represent a default pickup location or home address.
*   **Improvement/Consideration:**
    *   **Indices:** Add a unique index on `email` for efficient lookup and to enforce uniqueness.
    *   **GeoJSON:** Consider storing `location` as GeoJSON `Point` (e.g., `location: { type: 'Point', coordinates: [lng, lat] }`) for advanced geospatial queries (e.g., finding users near a pickup request).
    *   **Refresh Tokens:** For enhanced security and UX, consider adding `refreshToken` and `refreshTokenExpiry` fields for JWT refresh token management.

### PickupRequest:
```javascript
{
  _id,
  userId,
  workerId, // Can be null
  location: { lat, lng },
  imageUrl,
  status: "pending" | "assigned" | "in_progress" | "completed",
  createdAt,
  updatedAt
}
```
*   **Validation:** Good. Covers the core aspects of a pickup request. `userId` and `workerId` correctly link to the `User` collection. `status` provides clear workflow states.
*   **Improvement/Consideration:**
    *   **Indices:** Add an index on `userId`, `workerId`, and `status` for faster querying, especially for admin dashboards and worker task lists.
    *   **GeoJSON:** Similar to `User`, consider GeoJSON for `location` for efficient spatial queries (e.g., finding requests in a certain area).
    *   **Denormalization:** For quicker display of user/worker names in the admin/worker apps without extra lookups, consider denormalizing `userName` and `workerName` into this collection at the time of creation/assignment. This is a common NoSQL pattern.
    *   **Timestamps:** MongoDB's built-in `timestamps: true` option in Mongoose schemas can automatically manage `createdAt` and `updatedAt`.
    *   **Notes:** Add an optional `notes` field for users to provide additional details about the pickup.

### WorkerTaskLog:
```javascript
{
  _id,
  workerId,
  pickupId,
  startTime,
  endTime,
  status
}
```
*   **Validation:** Good. Tracks the worker's interaction with a specific pickup request. `startTime` and `endTime` are crucial for analytics.
*   **Improvement/Consideration:**
    *   **Indices:** Add an index on `workerId` and `pickupId` for efficient lookup.
    *   **Status Redundancy:** The `status` field here largely mirrors `PickupRequest.status` for the specific task. Ensure consistency between these two. It might be simpler to derive this status from `PickupRequest.status` and `workerId` presence, or ensure strict updates between them.
    *   **Denormalization:** Similar to `PickupRequest`, consider denormalizing `workerName` and `pickupLocation` for easier display in worker apps.
    *   **Completion Details:** Add `completionNotes` or `completionPhoto` for workers to record details or proof of completion.

### Dustbin (IoT optional):
```javascript
{
  _id,
  location: { lat, lng },
  fillLevel: Number, // 0–100
  lastUpdated: Date
}
```
*   **Validation:** Good. Simple and effective for storing IoT sensor data.
*   **Improvement/Consideration:**
    *   **Indices:** Add a geospatial index on `location` (if using GeoJSON) for efficient nearby dustbin queries.
    *   **GeoJSON:** Strongly recommend using GeoJSON `Point` for `location` to leverage MongoDB's powerful geospatial query capabilities (`$near`, `$geoWithin`).
    *   **`dustbinId` (External ID):** If `_id` is an internal MongoDB ID, consider adding an external `hardwareId` field for easier mapping to physical devices.
    *   **Historical Data:** If historical fill level trends are needed, consider a separate `DustbinHistory` collection or an embedded array in `Dustbin` (if updates are not too frequent and data size is manageable).

## General Database Best Practices for MongoDB:

1.  **Indexing:** Ensure appropriate indices are created for frequently queried fields (e.g., `email`, `userId`, `workerId`, `status`, `location`). Geospatial indices are critical for location-based queries.
2.  **Schema Validation:** Use Mongoose schema validation to enforce data types, required fields, and other constraints at the application level.
3.  **Data Modeling (Embedding vs. Referencing):** The current design largely uses referencing, which is good for many-to-many or when documents need to stand alone. For frequently accessed, smaller pieces of related data, consider embedding (denormalization) to reduce joins/lookups (e.g., embedding basic `userName` in `PickupRequest`).
4.  **Security:** Ensure MongoDB is secured (network access, authentication, encryption). MongoDB Atlas handles much of this, but application-level security (e.g., preventing injection) is crucial.
5.  **Transactions:** For operations requiring multiple document updates to be atomic (e.g., assigning a pickup and creating a task log), use MongoDB's multi-document transactions.
6.  **Connection Pooling:** Configure Mongoose to use connection pooling effectively in the Node.js application.
