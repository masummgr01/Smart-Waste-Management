# Entity-Relationship Diagram (ERD)

This ERD illustrates the relationships between the different collections in the MongoDB database.

```mermaid
erDiagram
    User ||--o{ PickupRequest : "requests" UserManager
    User ||--o{ WorkerTaskLog : "performs" Workers
    PickupRequest ||--o| WorkerTaskLog : "logs_task_for"

    User {
        string _id PK
        string name
        string email UNIQUE
        string passwordHash
        string role "user"/"admin"/"worker"
        string phone
        object location
        float location_lat
        float location_lng
    }

    PickupRequest {
        string _id PK
        string userId FK "User._id"
        string workerId FK "User._id" NULL
        object location
        float location_lat
        float location_lng
        string imageUrl
        string status "pending"/"assigned"/"in_progress"/"completed"
        datetime createdAt
        datetime updatedAt
    }

    WorkerTaskLog {
        string _id PK
        string workerId FK "User._id"
        string pickupId FK "PickupRequest._id"
        datetime startTime
        datetime endTime NULL
        string status "assigned"/"in_progress"/"completed"
    }

    Dustbin {
        string _id PK
        object location
        float location_lat
        float location_lng
        int fillLevel "0-100"
        datetime lastUpdated
    }

```
