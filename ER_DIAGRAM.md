# Entity Relationship Diagram

This document illustrates the database schema for the Employee Management System.

## Diagram

```mermaid
erDiagram
    USERS {
        bigint id PK "Auto Increment"
        varchar(50) username "Unique"
        varchar(255) password "Encrypted"
        varchar(100) fullName
        varchar(100) email "Unique"
        varchar(20) role "Default: USER"
        boolean enabled "Default: true"
        datetime createdAt
        datetime updatedAt
    }

    EMPLOYEES {
        varchar(255) empCode PK
        varchar(255) firstName
        varchar(255) lastName
        varchar(255) address
        varchar(255) NIC
        varchar(255) mobileNo
        varchar(255) gender
        varchar(255) email
        varchar(255) designation
        varchar(255) status
        varchar(255) dob
        varchar(255) imageName
        varchar(255) imageType
        blob imageData
    }

    %% Relationships
    %% Currently, there are no explicit foreign key relationships defined
    %% between Users (System Access) and Employees (HR Records) in the provided models.
    %% They function as independent modules.
```

## Entity Details

### 1. USERS Table

Stores system administrator and user credentials for application access.

- **id**: Primary Key, unique identifier.
- **username**: Unique login identifier.
- **password**: Hashed password for security.
- **role**: Determines access level (e.g., ADMIN, USER).

### 2. EMPLOYEES Table

Stores the core HR data for the organization.

- **empCode**: Primary Key, unique employee identifier (e.g., EMP001).
- **NIC**: National Identity Card number.
- **imageData**: Stores the employee's profile picture as a BLOB (Binary Large Object).
