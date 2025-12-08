# Employee Management System

## Project Overview

The **Employee Management System** is a robust full-stack application designed to streamline HR processes. It provides a comprehensive interface for managing employee records, tracking workforce statistics, and ensuring data integrity through advanced validation mechanisms.

The system is built using a modern tech stack, featuring a **Spring Boot** backend for secure API handling and an **Angular** frontend for a dynamic user experience.

## Key Features

### 1. User Authentication & Security

- **Secure Login**: JWT (JSON Web Token) based authentication.
- **Role-Based Access**: Secure endpoints protected by Spring Security.

### 2. Employee Management

- **CRUD Operations**: Create, Read, Update, and Delete employee records.
- **Advanced Search**: Filter employees by Code, NIC, Name, or Status.
- **Profile Management**: Detailed views for individual employee data.

### 3. Advanced Form Validation

- **Strict Input Patterns**:
  - **Mobile No**: Validates `07XXXXXXXX` format.
  - **NIC**: Supports both old (9 digits + V/X) and new (12 digits) formats.
  - **Name**: Ensures names contain only alphabets.
- **Business Logic Validation**:
  - **Age Restriction**: Custom validator ensures employees are at least 18 years old.

### 4. Smart Features

- **Face Detection**: Integrated **face-api.js** to ensure uploaded profile images contain a human face.
- **Location Picker**: Integrated **Leaflet Maps** allowing users to pick addresses directly from an interactive map.

### 5. Dashboard & Reporting

- **Real-time Statistics**: Visual overview of total employees, active/inactive status, and other key metrics.
- **Report Generation**: Functionality to download employee reports in PDF or Excel formats.

---

## Technology Stack

### Backend

- **Language**: Java
- **Framework**: Spring Boot
- **Security**: Spring Security, JWT
- **Build Tool**: Maven
- **Database**: (Configured via `application.properties`, typically MySQL/PostgreSQL)

### Frontend

- **Framework**: Angular
- **Language**: TypeScript
- **Styling**: CSS3, Responsive Design
- **Libraries**:
  - `leaflet` (Map integration)
  - `face-api.js` (AI Face Detection)
  - `font-awesome` (Icons)

---

## Project Structure

```
root/
├── backend/            # Spring Boot Application
│   ├── src/main/java   # Source code (Controllers, Services, Models)
│   └── pom.xml         # Maven dependencies
│
└── frontend/           # Angular Application
    ├── src/app         # Main application logic
    ├── src/components  # Reusable components (e.g., MapPicker)
    └── package.json    # NPM dependencies
```

## Getting Started

### Prerequisites

- Java JDK 17+
- Node.js & npm
- Angular CLI

### Running the Backend

1. Navigate to the `backend` directory.
2. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Running the Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:4200`.
