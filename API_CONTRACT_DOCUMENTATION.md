# API Contract Documentation

This document describes all the API endpoints, their methods, request structures, and response formats.

## Base URL
`YOUR_BACKEND_API_URL/api/v1` (e.g., `http://localhost:5000/api/v1`)

## Authentication
All protected routes require a JWT token in the `Authorization` header: `Bearer <token>`.

---

## AUTH Endpoints

### 1. `POST /auth/register`
*   **Description:** Registers a new user, admin, or worker.
*   **Access:** Public
*   **Request Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "strongpassword123",
      "role": "user" // "admin" or "worker"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "token": "<jwt_token>",
      "user": {
        "_id": "6543210fedcba9876543210f",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "user"
      }
    }
    ```
*   **Error Response (400 Bad Request / 409 Conflict):**
    ```json
    {
      "success": false,
      "message": "Email already registered."
    }
    ```

### 2. `POST /auth/login`
*   **Description:** Authenticates a user and returns a JWT token.
*   **Access:** Public
*   **Request Body:**
    ```json
    {
      "email": "john.doe@example.com",
      "password": "strongpassword123"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "token": "<jwt_token>",
      "user": {
        "_id": "6543210fedcba9876543210f",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "user"
      }
    }
    ```
*   **Error Response (401 Unauthorized):**
    ```json
    {
      "success": false,
      "message": "Invalid credentials"
    }
    ```

---

## USER Endpoints

### 1. `POST /pickup/request`
*   **Description:** User requests a garbage pickup.
*   **Access:** Authenticated User
*   **Request Body (multipart/form-data for image upload):**
    *   `location`: `{ lat: Number, lng: Number }`
    *   `image`: `File` (optional)
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Pickup request created successfully.",
      "pickupRequest": {
        "_id": "6543210fedcba9876543210g",
        "userId": "6543210fedcba9876543210f",
        "location": { "lat": 34.0522, "lng": -118.2437 },
        "imageUrl": "https://res.cloudinary.com/your-cloud/image.jpg",
        "status": "pending",
        "createdAt": "2023-11-20T10:00:00.000Z"
      }
    }
    ```
*   **Error Response (400 Bad Request / 500 Server Error):**
    ```json
    {
      "success": false,
      "message": "Failed to create pickup request."
    }
    ```

### 2. `GET /pickup/status/:id`
*   **Description:** Get the status of a specific pickup request.
*   **Access:** Authenticated User (for their own requests), Admin
*   **URL Parameters:** `id` (PickupRequest ID)
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "pickupRequest": {
        "_id": "6543210fedcba9876543210g",
        "userId": "6543210fedcba9876543210f",
        "workerId": null, // or worker ID if assigned
        "location": { "lat": 34.0522, "lng": -118.2437 },
        "imageUrl": "https://res.cloudinary.com/your-cloud/image.jpg",
        "status": "pending",
        "createdAt": "2023-11-20T10:00:00.000Z",
        "updatedAt": "2023-11-20T10:00:00.000Z"
      }
    }
    ```
*   **Error Response (404 Not Found / 403 Forbidden):**
    ```json
    {
      "success": false,
      "message": "Pickup request not found or unauthorized."
    }
    ```

### 3. `GET /dustbins/nearby?lat=x&lng=y`
*   **Description:** Get nearby smart dustbin fill levels.
*   **Access:** Authenticated User
*   **Query Parameters:** `lat`, `lng`
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "dustbins": [
        {
          "_id": "6543210fedcba9876543210h",
          "location": { "lat": 34.0525, "lng": -118.2440 },
          "fillLevel": 75,
          "lastUpdated": "2023-11-20T10:05:00.000Z"
        }
      ]
    }
    ```
*   **Error Response (500 Server Error):**
    ```json
    {
      "success": false,
      "message": "Failed to retrieve nearby dustbins."
    }
    ```

---

## ADMIN Endpoints

### 1. `GET /admin/pickups`
*   **Description:** Get all pickup requests (can be filtered by status, workerId, etc.).
*   **Access:** Authenticated Admin
*   **Query Parameters:** `status` (optional), `workerId` (optional)
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "pickups": [
        // Array of PickupRequest objects
      ]
    }
    ```

### 2. `POST /admin/assign/:pickupId`
*   **Description:** Assign a pickup request to a worker.
*   **Access:** Authenticated Admin
*   **URL Parameters:** `pickupId`
*   **Request Body:**
    ```json
    {
      "workerId": "6543210fedcba9876543210w"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Pickup assigned successfully.",
      "pickupRequest": { /* updated PickupRequest object */ },
      "workerTaskLog": { /* new WorkerTaskLog object */ }
    }
    ```
*   **Error Response (400 Bad Request / 404 Not Found):**
    ```json
    {
      "success": false,
      "message": "Failed to assign pickup or pickup/worker not found."
    }
    ```

### 3. `POST /admin/route/optimize`
*   **Description:** Generate an optimized route for a given set of pickup requests (e.g., for a specific worker or area).
*   **Access:** Authenticated Admin
*   **Request Body:**
    ```json
    {
      "pickupIds": ["6543210fedcba9876543210g", "6543210fedcba9876543210k"],
      "startLocation": { "lat": 34.05, "lng": -118.25 } // Optional, e.g., depot location
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "optimizedRoute": [
        { "pickupId": "6543210fedcba9876543210g", "order": 1, "eta": "..." },
        { "pickupId": "6543210fedcba9876543210k", "order": 2, "eta": "..." }
      ],
      "totalDistance": "10km",
      "totalTime": "30min"
    }
    ```
*   **Error Response (500 Server Error):**
    ```json
    {
      "success": false,
      "message": "Failed to optimize route."
    }
    ```

### 4. `GET /admin/analytics`
*   **Description:** Get daily/weekly analytics data.
*   **Access:** Authenticated Admin
*   **Query Parameters:** `period` ("daily" or "weekly"), `startDate`, `endDate`
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "analytics": {
        "totalPickups": 150,
        "completedPickups": 120,
        "pendingPickups": 20,
        "averageCompletionTime": "45min",
        "workerPerformance": [
          { "workerId": "...", "name": "Worker 1", "completed": 30, "avgTime": "40min" }
        ]
      }
    }
    ```

---

## WORKER Endpoints

### 1. `GET /worker/tasks`
*   **Description:** Get all assigned tasks for the authenticated worker.
*   **Access:** Authenticated Worker
*   **Query Parameters:** `status` (optional: "assigned", "in_progress", "completed")
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "tasks": [
        {
          "_id": "6543210fedcba9876543210t",
          "pickupId": "6543210fedcba9876543210g",
          "pickupLocation": { "lat": 34.0522, "lng": -118.2437 },
          "status": "assigned",
          "user": { "name": "User Name", "phone": "123-456-7890" }
        }
      ]
    }
    ```

### 2. `PATCH /worker/tasks/:id/status`
*   **Description:** Update the status of a worker task (e.g., to 'in_progress' or 'completed').
*   **Access:** Authenticated Worker
*   **URL Parameters:** `id` (WorkerTaskLog ID)
*   **Request Body:**
    ```json
    {
      "status": "in_progress" // or "completed"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Task status updated successfully.",
      "workerTaskLog": { /* updated WorkerTaskLog object */ },
      "pickupRequest": { /* updated PickupRequest object */ }
    }
    ```
*   **Error Response (400 Bad Request / 404 Not Found):**
    ```json
    {
      "success": false,
      "message": "Failed to update task status or task not found."
    }
    ```

---

## WebSocket Events (Socket.IO)

### Server Emits:

*   `newPickupRequest`: Emitted when a new pickup request is created. (Admin receives)
    ```json
    { "pickupRequest": { /* new PickupRequest object */ } }
    ```
*   `pickupAssigned`: Emitted when a pickup request is assigned to a worker. (User, Admin, Worker receive)
    ```json
    { "pickupRequest": { /* updated PickupRequest object */ }, "workerId": "..." }
    ```
*   `pickupStatusUpdated`: Emitted when a pickup request status changes (e.g., in_progress, completed).
    ```json
    { "pickupId": "...", "newStatus": "...", "workerId": "..." (optional) }
    ```

### Client Emits (Optional - for advanced features, not explicitly requested but good for bi-directional communication):

*   `workerLocationUpdate`: Worker app can emit its real-time location.
    ```json
    { "workerId": "...", "location": { "lat": "...", "lng": "..." } }
    ```
