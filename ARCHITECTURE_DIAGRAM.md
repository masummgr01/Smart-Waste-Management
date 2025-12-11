# System Architecture Diagram

This diagram illustrates the high-level components and their interactions within the Smart Waste Management & Garbage Pickup Scheduler system.

```mermaid
graph TD
    subgraph Frontend Applications
        U[User Web App] --- React
        A[Admin Web App] --- React
        W[Worker Mobile/Web App] --- React
    end

    subgraph Backend Services
        API_GW[API Gateway/Load Balancer]
        B[Node.js Express API]
        WS[Socket.IO WebSocket Server]
        CLD[Cloudinary (Image Storage)]
    end

    subgraph Database
        DB[MongoDB Atlas]
    end

    subgraph External Services
        GM[Google Maps/Directions API]
    end

    U -- HTTP/S (Axios) --> API_GW
    A -- HTTP/S (Axios) --> API_GW
    W -- HTTP/S (Axios) --> API_GW

    API_GW -- Route Requests --> B
    B -- Data Persistence --> DB
    B -- Image Upload/Retrieval --> CLD
    B -- Real-time Updates --> WS
    B -- Route Optimization --> GM

    WS -- Real-time Sync --> U
    WS -- Real-time Sync --> A
    WS -- Real-time Sync --> W

    style U fill:#f9f,stroke:#333,stroke-width:2px
    style A fill:#bbf,stroke:#333,stroke-width:2px
    style W fill:#bfb,stroke:#333,stroke-width:2px
    style B fill:#fcf,stroke:#333,stroke-width:2px
    style DB fill:#ccf,stroke:#333,stroke-width:2px
    style CLD fill:#cfc,stroke:#333,stroke-width:2px
    style WS fill:#ffc,stroke:#333,stroke-width:2px
    style GM fill:#cff,stroke:#333,stroke-width:2px
```

## Component Descriptions:

*   **User Web App (React):** Allows users to register, login, request garbage pickups with location and photos, view pickup status, and see nearby dustbin locations.
*   **Admin Web App (React):** Provides admin with a dashboard to view all pickup requests on a map, assign workers to requests, monitor worker performance, access analytics, and trigger route optimization.
*   **Worker Mobile/Web App (React):** Enables workers to login, view assigned tasks, navigate to pickup locations, and mark tasks as completed.
*   **API Gateway/Load Balancer:** Acts as the entry point for all client requests, routing them to the appropriate backend service. (Implicitly handled by cloud provider or can be explicitly set up with Nginx/similar).
*   **Node.js Express API:** The core backend service. Handles user authentication (JWT), manages pickup requests, worker assignments, and interacts with the database and external services.
*   **Socket.IO WebSocket Server:** Enables real-time communication for instant status updates across all client applications (user, admin, worker).
*   **MongoDB Atlas:** Cloud-hosted NoSQL database for storing all application data (users, pickup requests, task logs, dustbins).
*   **Cloudinary:** Cloud-based service for storing and managing image uploads (e.g., photos attached to pickup requests).
*   **Google Maps/Directions API:** Used for displaying maps on client applications and for calculating optimized routes for workers.
