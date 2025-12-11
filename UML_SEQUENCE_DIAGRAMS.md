# UML Sequence Diagrams

This section details the interaction sequences for two core functionalities: User Requesting a Pickup and Admin Assigning a Pickup to a Worker.

## 1. User Request Pickup Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as User App (React)
    participant Backend as Node.js API
    participant Cloudinary
    participant MongoDB as Database
    participant WebSocket as Socket.IO Server
    participant Admin as Admin App (React)
    participant Worker as Worker App (React)

    User->>Frontend: Clicks 'Request Pickup'
    Frontend->>User: Displays pickup request form
    User->>Frontend: Enters location, adds photo (optional), submits

    alt Photo Provided
        Frontend->>Cloudinary: Uploads image file
        Cloudinary-->>Frontend: Returns image URL
    end

    Frontend->>Backend: POST /pickup/request {location, imageUrl, userId}
    activate Backend
    Backend->>MongoDB: Saves new PickupRequest (status: 'pending')
    MongoDB-->>Backend: Returns new PickupRequest object
    Backend->>WebSocket: Emits 'newPickupRequest' event (to Admin)
    Backend-->>Frontend: Returns success response {pickupId, status}
    deactivate Backend

    Frontend->>User: Displays confirmation and pickup status 'pending'

    WebSocket->>Admin: Receives 'newPickupRequest' event
    Admin->>Admin: Updates map/dashboard with new pending request
```

## 2. Admin Assigns Pickup to Worker Flow

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend as Admin App (React)
    participant Backend as Node.js API
    participant MongoDB as Database
    participant WebSocket as Socket.IO Server
    participant Worker as Worker App (React)

    Admin->>Frontend: Views pending requests on map
    Admin->>Frontend: Selects a pending request, clicks 'Assign Worker'
    Frontend->>Admin: Displays worker assignment modal
    Admin->>Frontend: Selects a worker, confirms assignment

    Frontend->>Backend: POST /admin/assign/:pickupId {workerId}
    activate Backend
    Backend->>MongoDB: Updates PickupRequest (pickupId: status 'assigned', workerId)
    MongoDB-->>Backend: Returns updated PickupRequest
    Backend->>MongoDB: Creates new WorkerTaskLog (status: 'assigned')
    MongoDB-->>Backend: Returns new WorkerTaskLog
    Backend->>WebSocket: Emits 'pickupAssigned' event (to User, Admin, Worker)
    Backend-->>Frontend: Returns success response
    deactivate Backend

    Frontend->>Admin: Updates dashboard with assigned request

    WebSocket->>Worker: Receives 'pickupAssigned' event
    Worker->>Worker: Updates assigned tasks list (new task appears)
    Worker->>Worker: (Optional) Displays notification for new task

    WebSocket->>User: Receives 'pickupAssigned' event
    User->>User: Updates pickup status to 'assigned' in their app
```
