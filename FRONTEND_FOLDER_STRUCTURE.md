# Frontend Folder Structure (React with Vite + TailwindCSS)

This outlines a typical, scalable folder structure for a React application using Vite, organized for multiple user roles.

```
/frontend
├── public
│   └── vite.svg
├── src
│   ├── assets
│   │   ├── images
│   │   └── icons
│   ├── components
│   │   ├── common
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── admin
│   │   │   ├── AdminSidebar.jsx
│   │   │   └── WorkerAssignmentModal.jsx
│   │   ├── user
│   │   │   └── PickupRequestForm.jsx
│   │   └── worker
│   │       └── TaskCard.jsx
│   ├── contexts
│   │   ├── AuthContext.jsx
│   │   └── SocketContext.jsx
│   ├── hooks
│   │   ├── useAuth.js
│   │   └── useMap.js
│   ├── layouts
│   │   ├── AuthLayout.jsx
│   │   ├── UserLayout.jsx
│   │   ├── AdminLayout.jsx
│   │   └── WorkerLayout.jsx
│   ├── pages
│   │   ├── Auth
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── User
│   │   │   ├── UserDashboardPage.jsx
│   │   │   ├── RequestPickupPage.jsx
│   │   │   └── UserStatusPage.jsx
│   │   ├── Admin
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AdminMapPage.jsx
│   │   │   ├── AdminAnalyticsPage.jsx
│   │   │   └── AdminWorkerPerformancePage.jsx
│   │   ├── Worker
│   │   │   ├── WorkerDashboardPage.jsx
│   │   │   └── WorkerTaskDetailsPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── services
│   │   ├── auth.js
│   │   ├── api.js (Axios instance)
│   │   ├── pickup.js
│   │   ├── admin.js
│   │   ├── worker.js
│   │   ├── cloudinary.js
│   │   └── websocket.js
│   ├── utils
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validation.js
│   ├── App.jsx (Main application component with routing)
│   ├── main.jsx (Entry point)
│   └── index.css (TailwindCSS imports and base styles)
├── .env
├── .gitignore
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── README.md
└── vite.config.js
```

## Explanation of Key Directories:

*   **`public/`**: Static assets that are served directly.
*   **`src/`**: Contains all source code.
    *   **`assets/`**: Static files like images, icons, fonts.
    *   **`components/`**: Reusable UI components.
        *   **`common/`**: Components used across different parts of the application (e.g., `Header`, `Footer`).
        *   **`admin/`, `user/`, `worker/`**: Role-specific components.
    *   **`contexts/`**: React Context API for global state management (e.g., authentication, WebSocket connection).
    *   **`hooks/`**: Custom React hooks for reusable logic.
    *   **`layouts/`**: Components defining the overall page structure for different roles or authentication states.
    *   **`pages/`**: Top-level components representing distinct views or pages in the application. Organized by role.
    *   **`services/`**: Modules for interacting with the backend API, Cloudinary, and WebSocket server. Encapsulates API calls.
    *   **`utils/`**: Helper functions, constants, and utility logic.
    *   **`App.jsx`**: The root component where routing is configured.
    *   **`main.jsx`**: The entry point for the React application.
    *   **`index.css`**: Main CSS file, typically where TailwindCSS is imported.
*   **`.env`**: Environment variables (e.g., API base URL, Cloudinary credentials).
*   **`tailwind.config.js`**, **`postcss.config.js`**: Tailwind CSS configuration files.
*   **`vite.config.js`**: Vite build tool configuration.
