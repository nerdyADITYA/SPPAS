# Automated Security Personnel Post Allocation System (SPPAS)

[![System Architecture](https://img.shields.io/badge/Architecture-Distributed%20Microservices-blue.svg)](#system-architecture--technology-stack)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20Prisma%20ORM-green.svg)](#backend-service-layer)
[![Biometric Engine](https://img.shields.io/badge/Biometric%20Engine-Python%203%20%7C%20PyZK%20%7C%20ISAPI-orange.svg)](#python-biometric-polling-service)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20MUI-cyan.svg)](#frontend-presentation-layer)
[![Database](https://img.shields.io/badge/Database-MySQL%208-blue.svg)](#database-architecture--data-dictionary)

---

## Executive Summary & System Vision

The **Automated Security Personnel Post Allocation System (SPPAS)** is an enterprise-grade, real-time security management platform designed for large industrial complexes, high-security facilities, corporate campuses, power plants, and critical infrastructure installations.

Managing security guard deployments in multi-shift enterprise environments poses severe operational challenges:
- **Manual Rostering Delay**: Assigning hundreds of security guards to specific duty posts every shift manually causes severe delays at shift changeovers, leaving high-security zones vulnerable.
- **Skill & Requirement Mismatch**: Deploying unqualified personnel to high-risk posts (e.g. Data Centers, Perimeter Gates, Cash Vaults, Hazardous Storage) leads to regulatory non-compliance and security breaches.
- **Single Point Failure & Ghost Deployment**: Lack of real-time attendance validation results in unstaffed posts remaining unnoticed until a critical incident occurs.
- **Hardware Diversity**: Integrating biometric hardware from multiple vendors (e.g., ZKTeco fingerprint/face terminals and Hikvision ISAPI facial recognition turnstiles) usually requires disjointed legacy software.

**SPPAS** solves these problems by providing an automated, real-time end-to-end pipeline:
1. **Multithreaded Biometric Ingestion**: Dynamically polls physical hardware terminals (TCP/IP & REST ISAPI) across facility locations.
2. **Deterministic 2-Pass Post Allocation Engine**: Automatically matches incoming biometric punches against post priorities, skill levels, gender requirements, and shift timings within milliseconds.
3. **Control Room Real-Time Monitoring**: Pushes instant WebSocket updates to security dispatchers, alerting them immediately to unfilled critical posts or offline hardware.
4. **Supervisory Overrides & Automated Auditing**: Enables control room officers to perform manual guard re-assignments while keeping an immutable historical ledger of every allocation change.

---

## Table of Contents

- [Automated Security Personnel Post Allocation System (SPPAS)](#automated-security-personnel-post-allocation-system-sppas)
  - [Executive Summary \& System Vision](#executive-summary--system-vision)
  - [Table of Contents](#table-of-contents)
  - [System Architecture \& Technology Stack](#system-architecture--technology-stack)
    - [High-Level Architecture Diagram](#high-level-architecture-diagram)
    - [Technology Stack Matrix](#technology-stack-matrix)
  - [Repository Structure \& Complete File Inventory](#repository-structure--complete-file-inventory)
    - [Root Level Files](#root-level-files)
    - [Backend Service Layer (`/backend`)](#backend-service-layer-backend)
    - [Python Biometric Service (`/python-service`)](#python-biometric-service-python-service)
    - [Frontend Web Application (`/frontend`)](#frontend-web-application-frontend)
    - [Database Infrastructure (`/database`)](#database-infrastructure-database)
  - [Core Modules \& System Features](#core-modules--system-features)
    - [1. Authentication \& Single-Active-Session Control](#1-authentication--single-active-session-control)
    - [2. Guard \& Employee Master Management](#2-guard--employee-master-management)
    - [3. Biometric Hardware Integration (ZKTeco \& Hikvision ISAPI)](#3-biometric-hardware-integration-zkteco--hikvision-isapi)
    - [4. Real-Time Attendance Ingestion Pipeline](#4-real-time-attendance-ingestion-pipeline)
    - [5. Automated 2-Pass Guard Allocation Engine](#5-automated-2-pass-guard-allocation-engine)
      - [Pass 1: Minimum Guard Fulfillment](#pass-1-minimum-guard-fulfillment)
      - [Pass 2: Maximum Capacity Buffer Allocation](#pass-2-maximum-capacity-buffer-allocation)
      - [Allocation Constraint Rules Summary](#allocation-constraint-rules-summary)
    - [6. Duty Posts \& Category Management](#6-duty-posts--category-management)
    - [7. Shift Master \& Grace Period Management](#7-shift-master--grace-period-management)
    - [8. Control Room Live Dashboard \& WebSocket Streaming](#8-control-room-live-dashboard--websocket-streaming)
    - [9. Incident Alert Logging \& Exception Engine](#9-incident-alert-logging--exception-engine)
    - [10. Email Notification \& Administrative Alarm Engine](#10-email-notification--administrative-alarm-engine)
    - [11. Comprehensive Reporting \& Data Export System](#11-comprehensive-reporting--data-export-system)
    - [12. Live Simulation \& Test Bench Engine](#12-live-simulation--test-bench-engine)
    - [13. Emergency Health Synchronization](#13-emergency-health-synchronization)
    - [14. Fine-Grained Access Rights \& RBAC Matrix](#14-fine-grained-access-rights--rbac-matrix)
  - [Backend Repository Layer Specifications](#backend-repository-layer-specifications)
  - [Frontend Contexts \& Page Architecture](#frontend-contexts--page-architecture)
    - [1. Frontend React Context Providers](#1-frontend-react-context-providers)
    - [2. Frontend Application Pages](#2-frontend-application-pages)
  - [Python Biometric Service Architecture](#python-biometric-service-architecture)
  - [Database Architecture \& Data Dictionary](#database-architecture--data-dictionary)
    - [Entity Relationship Diagram](#entity-relationship-diagram)
    - [Master Tables Specification](#master-tables-specification)
    - [Transaction Tables Specification](#transaction-tables-specification)
    - [Enumerations Reference](#enumerations-reference)
  - [Complete API Reference Library](#complete-api-reference-library)
    - [1. Authentication Endpoints (`/api/v1/auth`)](#1-authentication-endpoints-apiv1auth)
    - [2. Employee Master Endpoints (`/api/v1/employees`)](#2-employee-master-endpoints-apiv1employees)
    - [3. Biometric Device Endpoints (`/api/v1/devices`)](#3-biometric-device-endpoints-apiv1devices)
    - [4. Attendance Processing Endpoints (`/api/v1/attendance`)](#4-attendance-processing-endpoints-apiv1attendance)
    - [5. Guard Deployments \& Allocation Endpoints (`/api/v1/deployments`)](#5-guard-deployments--allocation-endpoints-apiv1deployments)
    - [6. Duty Posts \& Post Category Endpoints (`/api/v1/posts`, `/api/v1/post-categories`)](#6-duty-posts--post-category-endpoints-apiv1posts-apiv1post-categories)
    - [7. Allocation Rules \& Restrictions Endpoints (`/api/v1/allocation-rules`, `/api/v1/restrictions`)](#7-allocation-rules--restrictions-endpoints-apiv1allocation-rules-apiv1restrictions)
    - [8. Dashboard Statistics \& Health Endpoints (`/api/v1/dashboard`, `/api/v1/health`)](#8-dashboard-statistics--health-endpoints-apiv1dashboard-apiv1health)
    - [9. Incident Alerts \& Reports Endpoints (`/api/v1/alerts`, `/api/v1/reports`)](#9-incident-alerts--reports-endpoints-apiv1alerts-apiv1reports)
    - [10. Simulation \& Test Bench Endpoints (`/api/v1/simulation`)](#10-simulation--test-bench-endpoints-apiv1simulation)
    - [11. Shift Master \& Access Rights Endpoints (`/api/v1/shifts`, `/api/v1/access-rights`)](#11-shift-master--access-rights-endpoints-apiv1shifts-apiv1access-rights)
  - [End-to-End Execution Code Flows](#end-to-end-execution-code-flows)
    - [1. Hardware Punch to Allocation Execution Pathway](#1-hardware-punch-to-allocation-execution-pathway)
    - [2. 2-Pass Guard Post Allocation Decision Flowchart](#2-2-pass-guard-post-allocation-decision-flowchart)
    - [3. Concurrent Login Single Active Session Eviction Flow](#3-concurrent-login-single-active-session-eviction-flow)
  - [Setup, Installation \& Configuration Guide](#setup-installation--configuration-guide)
    - [Prerequisites](#prerequisites)
    - [Environment Configuration](#environment-configuration)
    - [Database Initialization](#database-initialization)
    - [Running the Services](#running-the-services)
  - [Operations, Maintenance \& Troubleshooting](#operations-maintenance--troubleshooting)
    - [Common Issues \& Resolutions](#common-issues--resolutions)
    - [Logging \& Monitoring](#logging--monitoring)
  - [License \& Project Metadata](#license--project-metadata)

---

## System Architecture & Technology Stack

### High-Level Architecture Diagram

The system follows an event-driven microservice architecture with four decoupled operational tiers:

```mermaid
graph TB
    subgraph Hardware Layer
        D1[ZKTeco Biometric Terminal<br/>TCP/IP Port 4370]
        D2[Hikvision ISAPI Terminal<br/>HTTP REST / ISAPI]
    end

    subgraph Service Tier - Python 3
        PM[Main Process / Single Instance Guard]
        DM[Threaded Device Manager]
        W1[Device Worker Thread 1]
        W2[Device Worker Thread N]
        AP[Attendance Processor]
        AC[API Client - REST]
    end

    subgraph Core Tier - Node.js & Express
        EX[Express.js Web Server]
        MW[Auth & Permission Middlewares]
        AE[Automatic Allocation Engine]
        WS[Socket.IO Server]
        CR[Node-Cron Scheduler]
        EM[Nodemailer Email Service]
    end

    subgraph Persistence Layer - MySQL 8
        DB[(MySQL Database<br/>Prisma ORM)]
    end

    subgraph Presentation Tier - React 18
        UI[Vite + React Dashboard UI]
        SK[Socket.IO Client]
    end

    D1 -->|PyZK Socket| W1
    D2 -->|ISAPI JSON REST| W2
    PM --> DM
    DM --> W1
    DM --> W2
    W1 --> AP
    W2 --> AP
    AP --> AC
    AC -->|HTTP POST /attendance/punch| EX
    EX --> MW
    MW --> DB
    AE --> DB
    AE --> WS
    AE --> EM
    EM -->|SMTP Mail Dispatch| AdminMail[SuperAdmin Email]
    EM -->|SMTP Mail Dispatch| GuardMail[Guard Email]
    CR -->|Heartbeat Timeout Check| DB
    WS -->|WebSocket Event Stream| SK
    SK --> UI
```

---

### Technology Stack Matrix

| Layer | Component | Technologies / Libraries Used | Responsibility |
| :--- | :--- | :--- | :--- |
| **Frontend** | Framework | React 18, Vite | High-performance SPA frontend rendering |
| | UI Library | Material UI (MUI v5), Emotion | Modern responsive components & standard controls |
| | State & Async | TanStack React Query v5 | Server state caching, auto-refetching, mutation management |
| | Real-Time | Socket.IO Client v4 | Live WebSocket updates for punches, allocations & alerts |
| | Routing & Icons | React Router v6, Lucide React, MUI Icons | Client-side navigation & rich metric icons |
| **Backend** | Runtime & Server | Node.js (v18+), Express.js | Core API service, middleware routing & controller logic |
| | Database ORM | Prisma ORM v5 | Type-safe database queries, schema migrations & connection pooling |
| | Security | Helmet, Cors, bcryptjs, JsonWebToken (JWT) | HTTP security headers, CORS origin control, password hashing |
| | WebSockets | Socket.IO v4 | Real-time broadcasting to client browsers |
| | Scheduling | Node-Cron | Periodic background tasks (device heartbeat monitor) |
| | Communications | Nodemailer | SMTP HTML email notifications for guards & emergency admin alerts |
| **Python Service** | Core Engine | Python 3.10+, Requests | Independent background service for hardware device polling |
| | Device Protocols | `pyzk` (ZKTeco Protocol), HTTP Digest / Basic (Hikvision ISAPI) | Direct hardware socket interaction & REST event extraction |
| | Threading | Python `threading` Module, `socket` single instance | Concurrent polling worker threads per online biometric terminal |
| | Scheduling | `APScheduler` | Periodic re-syncing of registered devices from database API |
| **Database** | RDBMS | MySQL 8.0 | Transactional relational storage with FK constraints & indexes |

---

## Repository Structure & Complete File Inventory

```
Automated Security Personnel Post Allocation System/
├── .gitignore
├── README.md
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── allocation/
│       │   └── AllocationEngine.js
│       ├── config/
│       │   ├── env.js
│       │   ├── logger.js
│       │   └── prisma.js
│       ├── constants/
│       │   ├── messages.js
│       │   └── roles.js
│       ├── controllers/
│       │   ├── accessRightsController.js
│       │   ├── alertController.js
│       │   ├── allocationRuleController.js
│       │   ├── attendanceController.js
│       │   ├── authController.js
│       │   ├── dashboardController.js
│       │   ├── deploymentController.js
│       │   ├── deviceController.js
│       │   ├── employeeController.js
│       │   ├── postCategoryController.js
│       │   ├── postController.js
│       │   ├── reportController.js
│       │   ├── restrictionController.js
│       │   ├── shiftController.js
│       │   └── simulationController.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   ├── errorHandler.js
│       │   └── validationMiddleware.js
│       ├── repositories/
│       │   ├── AccessRightsRepository.js
│       │   ├── AlertRepository.js
│       │   ├── AllocationRuleRepository.js
│       │   ├── AttendanceRepository.js
│       │   ├── AuthRepository.js
│       │   ├── DeploymentRepository.js
│       │   ├── DeviceRepository.js
│       │   ├── EmployeeRepository.js
│       │   ├── PostCategoryRepository.js
│       │   ├── PostRepository.js
│       │   ├── ReportRepository.js
│       │   ├── RestrictionRepository.js
│       │   ├── ShiftRepository.js
│       │   └── VacancyRepository.js
│       ├── routes/
│       │   ├── accessRightsRoutes.js
│       │   ├── alertRoutes.js
│       │   ├── allocationRuleRoutes.js
│       │   ├── attendanceRoutes.js
│       │   ├── authRoutes.js
│       │   ├── dashboardRoutes.js
│       │   ├── deploymentRoutes.js
│       │   ├── deviceRoutes.js
│       │   ├── employeeRoutes.js
│       │   ├── healthRoutes.js
│       │   ├── index.js
│       │   ├── postCategoryRoutes.js
│       │   ├── postRoutes.js
│       │   ├── reportRoutes.js
│       │   ├── restrictionRoutes.js
│       │   ├── shiftRoutes.js
│       │   └── simulationRoutes.js
│       ├── scheduler/
│       │   └── cronJobs.js
│       ├── services/
│       │   ├── AccessRightsService.js
│       │   ├── AlertService.js
│       │   ├── AllocationRuleService.js
│       │   ├── AttendanceService.js
│       │   ├── AuthService.js
│       │   ├── DeploymentService.js
│       │   ├── DeviceService.js
│       │   ├── EmployeeService.js
│       │   ├── PostCategoryService.js
│       │   ├── PostService.js
│       │   ├── ReportService.js
│       │   ├── RestrictionService.js
│       │   ├── ShiftService.js
│       │   ├── VacancyService.js
│       │   └── emailService.js
│       ├── utils/
│       │   ├── SessionStore.js
│       │   ├── apiResponse.js
│       │   ├── jwt.js
│       │   └── password.js
│       ├── validators/
│       │   ├── attendanceValidator.js
│       │   ├── authValidator.js
│       │   ├── deploymentValidator.js
│       │   ├── deviceValidator.js
│       │   └── postValidator.js
│       └── websocket/
│           └── socketServer.js
├── database/
│   ├── init.sql
│   ├── seed.sql
│   └── seed_medium.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       │   └── ProtectedRoute.jsx
│       ├── contexts/
│       │   ├── AccessRightsContext.jsx
│       │   ├── AuthContext.jsx
│       │   ├── GuideContext.jsx
│       │   └── HealthSyncContext.jsx
│       ├── layouts/
│       │   └── AppLayout.jsx
│       ├── pages/
│       │   ├── AccessRightsPage.jsx
│       │   ├── AlertsPage.jsx
│       │   ├── AttendancePage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── DeploymentPage.jsx
│       │   ├── DevicesPage.jsx
│       │   ├── EmployeesPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── PostsPage.jsx
│       │   ├── ReportsPage.jsx
│       │   └── ShiftMasterPage.jsx
│       ├── services/
│       │   ├── api.js
│       │   └── socket.js
│       └── theme/
│           └── theme.js
└── python-service/
    ├── api_client.py
    ├── attendance_processor.py
    ├── config.py
    ├── device_manager.py
    ├── logger.py
    ├── main.py
    ├── requirements.txt
    ├── scheduler.py
    ├── simulate_live_punch.py
    └── validators.py
```

### Detailed File Descriptions

#### Root Level Files
- [`README.md`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/README.md): Master technical system documentation file.
- [`.gitignore`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/.gitignore): Specifies build outputs, node modules, `.env` secrets, and virtual environments to ignore in source control.

#### Backend Service Layer (`/backend`)
- [`src/server.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/server.js): Entry point for Node.js server. Binds HTTP server, Socket.IO websocket server, and initializes node-cron background tasks.
- [`src/app.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/app.js): Express application configuration, registers security headers (Helmet), CORS, JSON parsers, express rate limiters, and `/api/v1` routes.
- [`src/allocation/AllocationEngine.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/allocation/AllocationEngine.js): The core **2-Pass Automatic Guard Allocation Engine**. Fulfills post capacities using strict priority rules and updates post vacancy statistics.
- [`src/utils/SessionStore.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/utils/SessionStore.js): In-memory singleton managing active user sessions. Enforces **Single Active Session Per User** policy and triggers concurrent login revocations via WebSockets.
- [`src/middleware/authMiddleware.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/middleware/authMiddleware.js): Intercepts incoming HTTP requests, validates Bearer JWT tokens, enforces active session validity, and checks fine-grained module access permissions.
- [`src/middleware/errorHandler.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/middleware/errorHandler.js): Global Express error middleware returning standardized JSON error envelopes (`{ success: false, message, errors }`).
- [`src/services/emailService.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/services/emailService.js): Sends Nodemailer HTML emails for guard allocations and urgent administrative critical post vacancy alerts.
- [`prisma/schema.prisma`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/prisma/schema.prisma): Complete MySQL database schema definition containing 14 tables, relations, and 14 enums.

#### Python Biometric Service (`/python-service`)
- [`main.py`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/python-service/main.py): Entry point for Python attendance polling microservice. Ensures a single running instance via TCP socket binding (Port 47829).
- [`device_manager.py`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/python-service/device_manager.py): Multithreaded manager that queries registered devices from Node.js REST API, performs TCP ping checks, and spawns dedicated worker threads (`DeviceWorkerThread`) for online hardware.
- [`attendance_processor.py`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/python-service/attendance_processor.py): Manages local deduplication of raw biometric punches and transmits new physical punches to backend REST endpoints.
- [`api_client.py`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/python-service/api_client.py): HTTP client abstraction for communicating with backend REST endpoints (`/api/v1/devices`, `/api/v1/attendance/punch`, `/api/v1/devices/heartbeat`).
- [`simulate_live_punch.py`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/python-service/simulate_live_punch.py): Standalone script to simulate physical punches from hardware terminals into the service for testing.

#### Frontend Web Application (`/frontend`)
- [`src/App.jsx`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/frontend/src/App.jsx): React application root. Configures TanStack Query, Material UI theme, notification providers, and routing table.
- [`src/contexts/AuthContext.jsx`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/frontend/src/contexts/AuthContext.jsx): React Context handling authentication tokens, login/logout actions, user state persistence, and listening for WebSocket `SessionTerminated` events.
- [`src/contexts/AccessRightsContext.jsx`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/frontend/src/contexts/AccessRightsContext.jsx): Dynamically fetches and provides role-based module permissions across the frontend application.
- [`src/pages/DashboardPage.jsx`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/frontend/src/pages/DashboardPage.jsx): Central command dashboard displaying real-time post vacancy metrics, attendance counts, active alerts, device health statuses, and manual override dialogs.
- [`src/pages/DeploymentPage.jsx`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/frontend/src/pages/DeploymentPage.jsx): Guard post deployment management table supporting automatic allocation execution, supervisory manual post overrides, and deployment history logs.

#### Database Infrastructure (`/database`)
- [`init.sql`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/database/init.sql): Complete MySQL DDL initialization script creating all master and transaction tables, foreign keys, and indexes.
- [`seed.sql`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/database/seed.sql): SQL seed data for default admin users, post categories, initial duty posts, shifts, and allocation rules.
- [`seed_medium.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/database/seed_medium.js): Node.js data generator inserting realistic enterprise guards, biometric devices, duty posts, and historical transactions.

---

## Core Modules & System Features

### 1. Authentication & Single-Active-Session Control

- **JWT Authentication**: Users log in via `/api/v1/auth/login` using Employee Number (`EmpNo`) and Password. Password hashes are verified using `bcryptjs`.
- **Role Hierarchy**: Supports five security roles: `SUPERADMIN`, `ADMIN`, `SUPERVISOR`, `CONTROLROOM`, and `USER`.
- **Single Active Session Policy**:
  - The system enforces a strict single active session rule per user across all devices.
  - When a user logs in, `SessionStore` checks if an active session already exists for that `EmpNo`.
  - If an active session exists, the API returns `{ isConcurrent: true, activeSession: { ipAddress, loginTime } }` requiring confirmation.
  - Upon calling `/api/v1/auth/force-login`, the server revokes the old session, registers the new session, and broadcasts a `SessionTerminated_<EmpNo>` WebSocket event.
  - The former client browser receives the WebSocket message and automatically logs the user out with an administrative notice.

---

### 2. Guard & Employee Master Management

- Manages comprehensive profiles for security personnel, staff, and control room officers.
- Split across three relational data tables:
  - `employeemaster`: Core identification, Security Role, Department, Designation, Location, Skill Category (`CategoryCode`), and Account status (`Enable`).
  - `employeedates`: Operational dates including Date of Joining (`Doj`), Date of Birth (`DoBirth`), Weekly Off configurations, Police Verification Date, Medical Checkup Date, and Safety Training Date.
  - `employeepersonal`: Contact details, Emergency Contact, Permanent & Present Address, Blood Group, Medical Policy, and Email Address.

---

### 3. Biometric Hardware Integration (ZKTeco & Hikvision ISAPI)

- The `python-service` provides continuous, non-blocking hardware integration without requiring proprietary middle-tier software.
- **Multithreaded Polling Engine**:
  - `ThreadedDeviceManager` queries active devices from `/api/v1/devices` every minute.
  - Performs a rapid 3-second TCP socket ping test (`test_tcp_connection`).
  - Automatically spawns a dedicated worker thread (`DeviceWorkerThread`) for every online device.
  - If a device drops offline, its thread terminates cleanly and sends an `OFFLINE` heartbeat to the backend.
- **ZKTeco Terminal Driver**:
  - Interacts over TCP Port 4370 using `pyzk`.
  - Downloads attendance records via `conn.get_attendance()`.
  - Maps internal ZKTeco punch status codes (`1` or `5` -> `OUT`, default -> `IN`).
- **Hikvision ISAPI Terminal Driver**:
  - Queries Hikvision facial recognition / turnstile terminals over HTTP REST `/ISAPI/AccessControl/AcsEvent?format=json`.
  - Handles Digest Authentication (`HTTPDigestAuth`) and Basic Authentication fallback (`HTTPBasicAuth`).
  - Detects hardware security lockouts (`<lockStatus>lock</lockStatus>`) when brute-force passwords occur and logs warnings.
  - Automatically iterates through ISAPI paginated event logs (30 records per page).

---

### 4. Real-Time Attendance Ingestion Pipeline

```
[Biometric Terminal] -> [Python DeviceWorkerThread] -> [attendance_processor] 
  -> [POST /api/v1/attendance/punch] -> [Prisma DB Transaction] -> [Socket.IO Broadcast]
```

1. Hardware terminal records a physical card swipe or facial match.
2. `DeviceWorkerThread` captures the raw record (`empNo`, `punchDate`, `punchTime`, `deviceCode`).
3. `attendance_processor` filters out local duplicates using a synchronized timestamp cache.
4. Transmits record to `/api/v1/attendance/punch`.
5. Backend verifies guard existence, normalizes timestamp, creates a `securityattendance` entry with `AttendanceStatus: 'PENDING'`, and emits an `AttendanceReceived` WebSocket event.
6. Frontend Live Punch Feed updates instantaneously without page reloading.

---

### 5. Automated 2-Pass Guard Allocation Engine

The core operational intelligence resides in [`AllocationEngine.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/allocation/AllocationEngine.js). When triggered (manually via UI or automatically upon punch ingestion), the engine executes a deterministic 2-Pass algorithm.

```
       +-----------------------------------------------+
       |   Fetch Active Allocation Rules & Posts       |
       +-----------------------------------------------+
                               |
                               v
       +-----------------------------------------------+
       |  Fetch PENDING Guard Attendances (Asc Time)   |
       +-----------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| PASS 1: Fulfill MINIMUM Required Capacity (MinimumGuards)   |
| Iterates PENDING guards and assigns to posts needing MIN.  |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| PASS 2: Allocate Remainder to MAXIMUM Buffer Capacity       |
| Iterates unassigned guards and assigns to posts under MAX. |
+-------------------------------------------------------------+
                               |
                               v
       +-----------------------------------------------+
       |  Recalculate Post Vacancy Statistics          |
       +-----------------------------------------------+
                               |
                               v
       +-----------------------------------------------+
       | Check Critical Posts -> Log Alerts & Email    |
       +-----------------------------------------------+
```

#### Pass 1: Minimum Guard Fulfillment
- Iterates through all guards with `PENDING` attendance status in chronological order of reporting (`PunchTime ASC`).
- Evaluates candidate duty posts dynamically sorted by:
  1. `Priority ASC` (Priority 1 Critical Posts evaluated first).
  2. `CriticalPost DESC` (`Y` before `N`).
  3. `Vacant Shortage DESC` (Posts with the largest unfilled gap to `MinimumGuards` are filled first).
  4. `PostCode ASC` (Stable tie-breaker).
- Validates strict rules (Capacity `< MinimumGuards`, Gender matching, Skill Category matching).
- If matched, executes a database transaction:
  - Creates `securitydeployment` (`AllocationMethod: 'AUTO'`, `DeploymentStatus: 'ALLOCATED'`).
  - Creates audit record in `securitydeploymenthistory` (`ActionType: 'CREATED'`).
  - Updates `securityattendance` to `AttendanceStatus: 'ALLOCATED'`.
  - Triggers asynchronous Nodemailer email dispatch to the guard with duty details.

#### Pass 2: Maximum Capacity Buffer Allocation
- Iterates through remaining unassigned guards who were not matched in Pass 1.
- Re-evaluates posts, extending capacity up to `MaximumGuards`.
- Allows high-traffic posts to receive buffer security personnel when attendance exceeds minimum quotas.

#### Allocation Constraint Rules Summary

| Constraint | Rule Logic |
| :--- | :--- |
| **Capacity Constraint** | Pass 1: `currentGuards < MinimumGuards`. Pass 2: `currentGuards < MaximumGuards`. |
| **Gender Constraint** | If `GenderBasedAllocation == 'Y'` and `Post.FemaleOnly == 'Y'`, Guard `Gender` must be `'F'`. |
| **Priority 1 Skill Rule** | Priority 1 (Critical Posts) requires Guard `CategoryCode` 4 (High-Skilled) or 3 (Skilled). |
| **Priority 2 & 3 Skill Rule** | Priority 2 & 3 Posts require Guard `CategoryCode` 2 (Semi-Skilled). |
| **Priority 4 & 5 Skill Rule** | Priority 4 & 5 Posts accept Guard `CategoryCode` 1 (Un-Skilled). |

---

### 6. Duty Posts & Category Management

- **Post Categories** (`securitypostcategorymaster`): Logical groupings of duty locations (e.g. *Main Entrances*, *Perimeter Towers*, *Internal Infrastructure*, *Patrol Zones*).
- **Duty Posts** (`securitypostmaster`): Specific security posts assigned with operational parameters:
  - `Priority`: Integer priority scale from 1 (Highest / Critical) to 5 (Lowest).
  - `MinimumGuards` / `MaximumGuards`: Operational capacity constraints.
  - `FemaleOnly`: Restricts allocation to female personnel.
  - `CriticalPost`: Flag (`Y`/`N`). If unfilled during allocation, triggers automated escalation alarms.
  - `RestrictedPost`: Flag (`Y`/`N`). Indicates posts requiring specialized clearance.

---

### 7. Shift Master & Grace Period Management

- **Shifts** (`shiftmaster`): Defines daily operational shifts (e.g., Morning Shift A, Evening Shift B, Night Shift C).
- **Timing Parameters**:
  - `ShiftStartTime` / `ShiftEndTime`: Standard shift bounds.
  - `GraceAfterShiftStart`: Maximum allowable delay before marking late reporting.
  - `GraceBeforeShiftEnd`: Earliest allowable exit time.
  - `FullDayHrs` / `HalfDayHrs` / `LunchHrs`: Standard working duration thresholds.
  - `ShiftAlocation_StartTime` / `ShiftAlocation_EndTime`: Active window during which the automatic engine executes allocations.

---

### 8. Control Room Live Dashboard & WebSocket Streaming

- Accessible at `/dashboard`. Provides real-time operational oversight for security commanders:
  - **Metric Widgets**: Total Guards Present Today, Total Allocated Guards, Unallocated Guards, Active Incident Alerts Count, Biometric Devices Status (Total/Online/Offline).
  - **Live Duty Post Vacancy Grid**: Real-time breakdown of every duty post showing Required vs Allocated vs Vacant counts with color-coded status badges (`VACANT`, `PARTIALLY_ALLOCATED`, `FULLY_ALLOCATED`).
  - **Real-Time Punch Feed**: Live streaming card swipe entries broadcast via Socket.IO.
  - **Manual Guard Allocation Dialog**: Enables control room officers to manually allocate unassigned guards or reassign guards between posts with mandatory audit notes.

---

### 9. Incident Alert Logging & Exception Engine

- Maintained in `securityalertlog`. Automatically captures operational anomalies:

| Alert Type | Trigger Condition | Default Severity |
| :--- | :--- | :--- |
| `VACANT_POST` | Critical Post remains below `MinimumGuards` after allocation cycle | `CRITICAL` |
| `ABSENT_GUARD` | Allocated guard fails to punch in within shift start + grace period | `HIGH` |
| `LATE_REPORTING` | Guard punches in after shift start grace window | `MEDIUM` |
| `DEVICE_OFFLINE` | Biometric terminal fails heartbeat ping check for >10 minutes | `HIGH` |
| `AUTO_ALLOCATION_FAILED` | Pending guard cannot be matched to any available post | `MEDIUM` |
| `OVERTIME` | Guard duty duration exceeds shift standard hours | `LOW` |
| `UNAUTHORIZED_PUNCH` | Card punch registered on device with no matching employee profile | `HIGH` |

---

### 10. Email Notification & Administrative Alarm Engine

Implemented in [`emailService.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/services/emailService.js) using Nodemailer:
1. **Guard Allocation Notification**: When a guard is allocated to a post (auto or manual), an HTML email is dispatched with duty post details, location sector, shift timings, and supervisor instructions.
2. **Critical Post Vacancy Alarm**: When the engine finishes and detects unfilled Priority 1 Critical Posts:
   - Queries all active `SUPERADMIN` and `ADMIN` email addresses.
   - Dispatches an urgent alarm email containing a dark-themed summary table of missing critical coverage.
   - Prompts security management to log in and deploy reserve guards manually.
3. **Console Fallback Mode**: If SMTP credentials are missing in `.env`, the service operates seamlessly in Simulation Mode, logging email payloads to Winston logger without throwing errors.

---

### 11. Comprehensive Reporting & Data Export System

Accessible at `/reports`. Enables historical compliance auditing and operational reporting:
- **Daily Post Allocation Report**: Complete list of all guard deployments for a selected date and shift. Filterable by Post Category, Location, and Deployment Method (AUTO / MANUAL / OVERRIDE).
- **Guard Attendance Log**: Comprehensive report of raw biometric punches, reporting times, device serial numbers, and attendance status.
- **Critical Post Audit Trail**: Detailed record of unfilled post alerts and resolution actions taken.
- **CSV / Excel Export**: One-click client-side generation of downloadable CSV spreadsheets formatted for HR and payroll ingestion.

---

### 12. Live Simulation & Test Bench Engine

Accessible via the `/simulation` API endpoints and UI action controls. Designed for system testing and demonstration without physical biometric hardware:
- **Simulate Guard Punch** (`POST /api/v1/simulation/simulate-punch`): Selects active guards and creates raw biometric punches with `AttendanceStatus: 'PENDING'`. Emits real-time Socket.IO events to test live dashboard ingestion.
- **Reset Simulation State** (`POST /api/v1/simulation/reset`): Clears today's attendance punches, deployments, history logs, alerts, and recalculates vacant post counts back to a clean slate.

---

### 13. Emergency Health Synchronization

- Handled via `HealthSyncContext.jsx` on the frontend and `/api/v1/health` on the backend.
- Performs heartbeat checks every 30 seconds across system tiers:
  - **Backend Health**: Validates HTTP REST responsiveness and system uptime.
  - **Database Connection**: Executes a lightweight query (`SELECT 1`) to verify MySQL pool health.
  - **Biometric Hardware Sync**: Verifies active device ping statuses.
- Provides visual indicators in the application header alerting commanders to server or database connectivity issues.

---

### 14. Fine-Grained Access Rights & RBAC Matrix

- Configured via `AccessRightsRepository.js` and managed at `/access-rights`.
- Enables SuperAdmins to configure granular feature permissions per security role across system modules:

```
[Module Key] -> [Enabled: true/false] -> [Access Level: FULL_ACCESS / VIEW_ONLY]
```

- Enforced at backend API layer via `checkModuleAccess(moduleKey, actionType)` middleware. If a supervisor attempts to edit a post when their role is set to `VIEW_ONLY`, the server responds with `HTTP 403 Forbidden`.

---

## Backend Repository Layer Specifications

The backend follows the Repository Pattern, encapsulating data access logic using Prisma ORM.

| Repository Class | Primary File | Responsibilities & Core Methods |
| :--- | :--- | :--- |
| `AccessRightsRepository` | `AccessRightsRepository.js` | Manages role permission maps in memory (`getPermissionsForRole`, `updateRolePermissions`). Defaults SuperAdmins to full access. |
| `AlertRepository` | `AlertRepository.js` | Manages incident logs (`createAlert`, `getAlerts`, `resolveAlert`, `getUnresolvedAlertsCount`). |
| `AllocationRuleRepository`| `AllocationRuleRepository.js` | Fetches and updates automatic allocation engine parameters (`getActiveRule`, `updateRule`). |
| `AttendanceRepository` | `AttendanceRepository.js` | Manages biometric punches (`createAttendance`, `getPendingAttendances`, `updateAttendanceStatus`). |
| `AuthRepository` | `AuthRepository.js` | Queries employee accounts for login authentication (`findByEmpNo`). |
| `DeploymentRepository` | `DeploymentRepository.js` | Handles guard allocations and manual overrides (`createDeployment`, `getDeployments`, `getDeploymentHistory`). |
| `DeviceRepository` | `DeviceRepository.js` | Manages hardware device master records and heartbeat updates (`getAllDevices`, `updateDeviceStatus`). |
| `EmployeeRepository` | `EmployeeRepository.js` | Queries and updates guard profiles across relational tables (`getEmployees`, `createEmployee`, `updateEmployee`). |
| `PostCategoryRepository` | `PostCategoryRepository.js` | Manages duty post categories (`getAllCategories`, `createCategory`). |
| `PostRepository` | `PostRepository.js` | Handles duty post master records (`getActivePosts`, `getPostsByPriority`, `updatePost`). |
| `ReportRepository` | `ReportRepository.js` | Executes aggregated queries for daily deployment and attendance compliance reports. |
| `RestrictionRepository` | `RestrictionRepository.js` | Manages guard restriction rules (`getRestrictions`, `createRestriction`). |
| `ShiftRepository` | `ShiftRepository.js` | Manages shift timing masters (`getAllShifts`, `updateShift`). |
| `VacancyRepository` | `VacancyRepository.js` | Calculates and updates duty post vacancy statistics (`upsertVacancy`, `getVacanciesByShift`). |

---

## Frontend Contexts & Page Architecture

### 1. Frontend React Context Providers

- **`AuthProvider` (`AuthContext.jsx`)**:
  - Encapsulates authentication state (`user`, `token`, `isAuthenticated`).
  - Implements `login`, `forceLogin`, and `logout` actions.
  - Subscribes to dynamic WebSocket event `SessionTerminated_<EmpNo>` to enforce single-active-session revocation.
- **`AccessRightsProvider` (`AccessRightsContext.jsx`)**:
  - Queries dynamic role permission map from `/api/v1/access-rights`.
  - Exposes helper functions `hasAccess(moduleKey)` and `canMutate(moduleKey)` to conditionally render UI controls.
- **`HealthSyncProvider` (`HealthSyncContext.jsx`)**:
  - Runs periodic 30-second health ping probes to `/api/v1/health`.
  - Tracks server uptime, database latency, and device status counts.
- **`GuideProvider` (`GuideContext.jsx`)**:
  - Provides interactive system walkthrough tooltips and operational guidance for new security operators.

---

### 2. Frontend Application Pages

- **`LoginPage.jsx`**: Responsive dark-mode login portal featuring employee authentication, password toggle, and concurrent session resolution modals.
- **`DashboardPage.jsx`**: Central command center displaying live metric KPI cards, interactive vacancy grid, real-time punch stream, and emergency action controls.
- **`AttendancePage.jsx`**: Comprehensive attendance log table filterable by date, shift, guard name, and attendance status (`PENDING`, `ALLOCATED`, `REJECTED`).
- **`DeploymentPage.jsx`**: Guard deployment manager supporting automatic 2-pass allocation triggers, supervisory post override dialogs, and deployment audit logs.
- **`PostsPage.jsx`**: Duty post master configuration page for editing post priorities (1 to 5), guard capacities (`MinimumGuards`/`MaximumGuards`), `FemaleOnly` flags, and `CriticalPost` flags.
- **`DevicesPage.jsx`**: Biometric hardware terminals dashboard showing IP addresses, communication ports, online/offline status indicators, and instant TCP socket ping tools.
- **`AlertsPage.jsx`**: Security incident log page allowing control room officers to review active alarms and mark incidents as resolved with mandatory supervisor notes.
- **`ReportsPage.jsx`**: Auditing and compliance reporting portal supporting filterable deployment logs and one-click CSV export.
- **`ShiftMasterPage.jsx`**: Operational shift configuration interface for setting shift start/end times, grace windows, and overtime parameters.
- **`EmployeesPage.jsx`**: Employee and security guard master registry for adding, updating, and viewing guard skill levels, dates, and medical records.
- **`AccessRightsPage.jsx`**: Role-based access control matrix allowing SuperAdmins to enable/disable module access and toggle View-Only vs Full-Access permissions per role.

---

## Python Biometric Service Architecture

The `python-service` acts as an independent background daemon responsible for continuous hardware device monitoring and biometric log retrieval.

```
+-------------------------------------------------------------------+
|                        python-service/main.py                     |
|  - Binds single-instance lock socket (Port 47829)                 |
|  - Starts APScheduler for periodic device re-syncing              |
|  - Triggers ThreadedDeviceManager.sync_online_devices()          |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                    device_manager.py (Threaded)                   |
|  - Fetches registered devices from GET /api/v1/devices            |
|  - Runs 3-second TCP connection test (test_tcp_connection)        |
|  - Spawns dedicated DeviceWorkerThread for each ONLINE device     |
+-------------------------------------------------------------------+
          |                                       |
          v                                       v
+----------------------------------+  +-----------------------------------+
|     DeviceWorkerThread (ZK)      |  |    DeviceWorkerThread (ISAPI)     |
|  - Communicates over TCP 4370    |  |  - Communicates over HTTP REST    |
|  - PyZK get_attendance() logs    |  |  - ISAPI /AcsEvent pagination     |
+----------------------------------+  +-----------------------------------+
          |                                       |
          +-------------------+-------------------+
                              |
                              v
+-------------------------------------------------------------------+
|                     attendance_processor.py                       |
|  - Deduplicates raw punches against local timestamp cache         |
|  - Transmits new physical punches via api_client.py               |
|  - HTTP POST /api/v1/attendance/punch                             |
+-------------------------------------------------------------------+
```

---

## Database Architecture & Data Dictionary

### Entity Relationship Diagram

```mermaid
erDiagram
    locationmaster ||--o{ employeemaster : "hosts"
    locationmaster ||--o{ securitypostmaster : "contains"
    locationmaster ||--o{ securitydevicemaster : "installs"
    
    departmentmaster ||--o{ employeemaster : "belongs"
    designationmaster ||--o{ employeemaster : "assigned"
    categorymaster ||--o{ employeemaster : "classified"
    
    employeemaster ||--|| employeedates : "has"
    employeemaster ||--|| employeepersonal : "has"
    employeemaster ||--o{ securityattendance : "punches"
    employeemaster ||--o{ securitydeployment : "deployed"
    employeemaster ||--o{ securitydeploymenthistory : "audited"
    employeemaster ||--o{ securityalertlog : "notified"

    securitypostcategorymaster ||--o{ securitypostmaster : "categorizes"
    securitypostmaster ||--o{ securitydeployment : "allocates"
    securitypostmaster ||--o{ securitydeploymenthistory : "history"
    securitypostmaster ||--o{ securityalertlog : "alerts"
    securitypostmaster ||--o{ securitypostvacancy : "tracks"

    shiftmaster ||--o{ securityattendance : "regulates"
    shiftmaster ||--o{ securitydeployment : "schedules"
    shiftmaster ||--o{ securitydeploymenthistory : "schedules"
    shiftmaster ||--o{ securitypostvacancy : "schedules"

    securitydevicemaster ||--o{ securityattendance : "captures"
    securitydevicemaster ||--o{ securityalertlog : "monitors"
    
    securitydeployment ||--o{ securitydeploymenthistory : "tracks"
    securitydeployment ||--o{ securityalertlog : "references"
```

---

### Master Tables Specification

#### 1. `employeemaster` (Guard & Staff Master)
Primary Entity representing all security guards, supervisors, and administrative users.
- `EmpNo` (VARCHAR(20), **PK**): Unique Employee Number.
- `PunchCardNo` (INT): Biometric Punch Card / User ID mapped in hardware devices.
- `FirstName`, `MiddleName`, `LastName` (VARCHAR(50)): Full name components.
- `DepartmentCode` (FK -> `departmentmaster.DepartmentCode`): Assigned department.
- `DesignationCode` (FK -> `designationmaster.DesignationCode`): Job rank/designation.
- `CategoryCode` (FK -> `categorymaster.CategoryCode`): Skill category (1: Un-Skilled, 2: Semi-Skilled, 3: Skilled, 4: High-Skilled).
- `LocationCode` (FK -> `locationmaster.LocationCode`): Primary deployment location.
- `Gender` (VARCHAR(1)): `'M'` or `'F'`.
- `SecurityRole` (ENUM): Role rank (`SUPERADMIN`, `ADMIN`, `SUPERVISOR`, `CONTROLROOM`, `USER`).
- `Password` (TINYBLOB): Bcrypt hashed password bytes.
- `Enable` (CHAR(1)): `'Y'` (Active) or `'N'` (Disabled).

#### 2. `employeedates` (Guard Operational Dates)
- `EmpNo` (VARCHAR(20), **PK**, FK -> `employeemaster.EmpNo`, CASCADE DELETE): Employee reference.
- `Doj` (DATE): Date of Joining.
- `DoBirth` (DATE): Date of Birth.
- `WeeklyOffOne` (VARCHAR(9)): Primary weekly off day (e.g., `'Sunday'`).
- `PoliceVerificationDate` (DATE): Date of background police verification approval.
- `PeriodicMedicalDate` (DATE): Date of last mandatory medical examination.
- `SafetyTrainingDate` (DATE): Date of mandatory security training certification.

#### 3. `employeepersonal` (Guard Personal Details)
- `EmpNo` (VARCHAR(20), **PK**, FK -> `employeemaster.EmpNo`, CASCADE DELETE): Employee reference.
- `Mobile` (VARCHAR(15)): Primary contact phone number.
- `Email` (VARCHAR(150)): Email address for notifications.
- `EmergencyContact` (VARCHAR(255)): Emergency contact details.
- `BloodGroup` (VARCHAR(10)): Guard blood group.
- `PermanentAddress`, `CurrentAddress` (VARCHAR(255)): Residential addresses.

#### 4. `securitypostcategorymaster` (Duty Post Categories)
- `PostCategoryCode` (SMALLINT UNSIGNED, **PK**, AUTO_INCREMENT): Unique category ID.
- `PostCategoryName` (VARCHAR(100), **UNIQUE**): Category title (e.g., *Main Gates*, *Perimeter Towers*).
- `Description` (VARCHAR(255)): Operational summary.
- `Enable` (ENUM `'Y'`/`'N'`): Status.

#### 5. `securitypostmaster` (Duty Posts Master)
- `PostCode` (SMALLINT UNSIGNED, **PK**, AUTO_INCREMENT): Unique Duty Post ID.
- `PostName` (VARCHAR(100), **UNIQUE**): Duty Post Title (e.g., *Gate 1 Main Entrance*).
- `PostCategoryCode` (FK -> `securitypostcategorymaster.PostCategoryCode`): Category link.
- `LocationCode` (FK -> `locationmaster.LocationCode`): Location link.
- `Priority` (SMALLINT UNSIGNED): Priority rank (1 = Highest / Critical, 5 = Lowest).
- `MinimumGuards` (TINYINT UNSIGNED): Minimum required guard strength.
- `MaximumGuards` (TINYINT UNSIGNED): Maximum allowable guard strength.
- `FemaleOnly` (ENUM `'Y'`/`'N'`): Female guard restriction flag.
- `CriticalPost` (ENUM `'Y'`/`'N'`): Critical installation flag.
- `RestrictedPost` (ENUM `'Y'`/`'N'`): High-security clearance flag.

#### 6. `securitydevicemaster` (Biometric Terminals Master)
- `DeviceCode` (SMALLINT UNSIGNED, **PK**, AUTO_INCREMENT): Unique Device ID.
- `DeviceName` (VARCHAR(100)): Terminal title.
- `DeviceSerialNo` (VARCHAR(100), **UNIQUE**): Hardware serial number.
- `DeviceModel` (VARCHAR(100)): Hardware model (e.g., *ZKTeco K40*, *Hikvision DS-K1T671*).
- `IPAddress` (VARCHAR(45), **UNIQUE**): Static IPv4 / IPv6 address.
- `PortNo` (SMALLINT UNSIGNED): Network communication port (default `4370` for ZK, `80` for ISAPI).
- `Username`, `Password` (VARCHAR): Hardware authentication credentials.
- `CommunicationType` (ENUM): `'TCP/IP'`, `'USB'`, `'RS232'`.
- `DeviceStatus` (ENUM): `'ONLINE'`, `'OFFLINE'`, `'MAINTENANCE'`.
- `LastHeartbeat` (DATETIME): Timestamp of last successful TCP ping response.

---

### Transaction Tables Specification

#### 1. `securityattendance` (Raw & Processed Punch Ingestion)
- `AttendanceCode` (BIGINT UNSIGNED, **PK**, AUTO_INCREMENT): Unique attendance ID.
- `EmpNo` (FK -> `employeemaster.EmpNo`): Employee reference.
- `PunchCardNo` (INT): Card ID transmitted by hardware terminal.
- `DeviceCode` (FK -> `securitydevicemaster.DeviceCode`): Terminal reference.
- `PunchDate` (DATE): Date of punch.
- `PunchTime` (TIME): Time of punch.
- `PunchDateTime` (DATETIME): Combined ISO timestamp.
- `ShiftCode` (FK -> `shiftmaster.ShiftCode`): Identified operational shift.
- `PunchType` (ENUM): `'IN'` or `'OUT'`.
- `AttendanceStatus` (ENUM): `'PENDING'`, `'ALLOCATED'`, `'REJECTED'`, `'DUPLICATE'`.

#### 2. `securitydeployment` (Guard Duty Post Deployments)
- `DeploymentCode` (BIGINT UNSIGNED, **PK**, AUTO_INCREMENT): Unique deployment ID.
- `DeploymentDate` (DATE): Target deployment date.
- `EmpNo` (FK -> `employeemaster.EmpNo`): Deployed guard.
- `PostCode` (FK -> `securitypostmaster.PostCode`): Assigned duty post.
- `ShiftCode` (FK -> `shiftmaster.ShiftCode`): Operational shift.
- `ReportingTime` (DATETIME): Time guard reported to post.
- `AllocationMethod` (ENUM): `'AUTO'`, `'MANUAL'`, `'OVERRIDE'`.
- `DeploymentStatus` (ENUM): `'ALLOCATED'`, `'REPORTED'`, `'COMPLETED'`, `'ABSENT'`, `'CANCELLED'`.
- `AllocatedBy` (FK -> `employeemaster.EmpNo`): User/Engine initiating deployment.
- `ApprovedBy` (FK -> `employeemaster.EmpNo`): Supervisor approving deployment.
- **Unique Composite Key**: `[DeploymentDate, EmpNo, ShiftCode]`. Prevents double-booking a guard within the same shift.

#### 3. `securitydeploymenthistory` (Immutable Audit Ledger)
- `HistoryCode` (BIGINT UNSIGNED, **PK**, AUTO_INCREMENT): Unique audit record ID.
- `DeploymentCode` (FK -> `securitydeployment.DeploymentCode`, CASCADE DELETE): Deployment reference.
- `EmpNo` (FK -> `employeemaster.EmpNo`): Guard reference.
- `PostCode` (FK -> `securitypostmaster.PostCode`): Post reference.
- `ShiftCode` (FK -> `shiftmaster.ShiftCode`): Shift reference.
- `DeploymentStatus` (ENUM): Status snapshot.
- `ActionType` (ENUM): `'CREATED'`, `'UPDATED'`, `'OVERRIDDEN'`, `'STATUS_CHANGED'`, `'DELETED'`.
- `ChangedBy` (FK -> `employeemaster.EmpNo`): Officer who performed change.
- `Remarks` (VARCHAR(255)): Mandatory reason/notes for change.

#### 4. `securityalertlog` (Incident Alerts Log)
- `AlertCode` (BIGINT UNSIGNED, **PK**, AUTO_INCREMENT): Unique alert ID.
- `AlertDateTime` (DATETIME): Alert creation timestamp.
- `AlertType` (ENUM): Type of anomaly (`VACANT_POST`, `ABSENT_GUARD`, `LATE_REPORTING`, `DEVICE_OFFLINE`, `AUTO_ALLOCATION_FAILED`, `OVERTIME`, `UNAUTHORIZED_PUNCH`).
- `Severity` (ENUM): `'LOW'`, `'MEDIUM'`, `'HIGH'`, `'CRITICAL'`.
- `DeploymentCode` (FK -> `securitydeployment.DeploymentCode`): Associated deployment if applicable.
- `EmpNo` (FK -> `employeemaster.EmpNo`): Associated guard if applicable.
- `PostCode` (FK -> `securitypostmaster.PostCode`): Associated post if applicable.
- `DeviceCode` (FK -> `securitydevicemaster.DeviceCode`): Associated device if applicable.
- `AlertMessage` (VARCHAR(500)): Detailed alert text.
- `Resolved` (ENUM `'Y'`/`'N'`): Resolution flag.
- `ResolvedBy` (FK -> `employeemaster.EmpNo`): Officer who resolved alert.

#### 5. `securitypostvacancy` (Real-Time Vacancy Statistics)
- `VacancyCode` (BIGINT UNSIGNED, **PK**, AUTO_INCREMENT): Unique record ID.
- `VacancyDate` (DATE): Target date.
- `PostCode` (FK -> `securitypostmaster.PostCode`): Post reference.
- `ShiftCode` (FK -> `shiftmaster.ShiftCode`): Shift reference.
- `RequiredGuards` (SMALLINT UNSIGNED): Target minimum requirement.
- `AllocatedGuards` (SMALLINT UNSIGNED): Count of allocated guards.
- `PresentGuards` (SMALLINT UNSIGNED): Count of guards present at post.
- `VacantGuards` (SMALLINT UNSIGNED): Net vacant shortage (`RequiredGuards - AllocatedGuards`).
- `Status` (ENUM): `'VACANT'`, `'PARTIALLY_ALLOCATED'`, `'FULLY_ALLOCATED'`.
- **Unique Composite Key**: `[VacancyDate, PostCode, ShiftCode]`.

---

### Enumerations Reference

```typescript
enum SecurityRole { SUPERADMIN, ADMIN, SUPERVISOR, CONTROLROOM, USER }
enum DeviceStatus { ONLINE, OFFLINE, MAINTENANCE }
enum CommunicationType { TCPIP, USB, RS232 }
enum PunchType { IN, OUT }
enum AttendanceStatus { PENDING, ALLOCATED, REJECTED, DUPLICATE }
enum AllocationMethod { AUTO, MANUAL, OVERRIDE }
enum DeploymentStatus { ALLOCATED, REPORTED, COMPLETED, ABSENT, CANCELLED }
enum ActionType { CREATED, UPDATED, OVERRIDDEN, STATUS_CHANGED, DELETED }
enum AlertType { VACANT_POST, ABSENT_GUARD, LATE_REPORTING, DEVICE_OFFLINE, AUTO_ALLOCATION_FAILED, OVERTIME, UNAUTHORIZED_PUNCH }
enum Severity { LOW, MEDIUM, HIGH, CRITICAL }
enum VacancyStatus { VACANT, PARTIALLY_ALLOCATED, FULLY_ALLOCATED }
```

---

## Complete API Reference Library

All API endpoints are prefixed with `/api/v1` and require HTTP Header `Authorization: Bearer <JWT_TOKEN>` unless noted.

### 1. Authentication Endpoints (`/api/v1/auth`)

#### `POST /auth/login`
Authenticates a user and registers an active session.

- **Request Body**:
```json
{
  "empNo": "1001",
  "password": "Password@123"
}
```
- **Response (200 OK - Standard Success)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "empNo": "1001",
      "firstName": "Aditya",
      "lastName": "Kadia",
      "gender": "M",
      "role": "SUPERADMIN",
      "department": "Security Control",
      "designation": "Chief Security Officer",
      "location": "Main Campus"
    },
    "isConcurrent": false
  }
}
```
- **Response (200 OK - Concurrent Active Session Detected)**:
```json
{
  "success": true,
  "message": "Concurrent login detected",
  "data": {
    "isConcurrent": true,
    "activeSession": {
      "ipAddress": "192.168.1.45",
      "loginTime": "2026-08-13T08:00:00.000Z"
    },
    "user": { "empNo": "1001", "firstName": "Aditya", "role": "SUPERADMIN" }
  }
}
```

#### `POST /auth/force-login`
Revokes an existing active session on another device and issues a fresh session token.

- **Request Body**:
```json
{
  "empNo": "1001",
  "password": "Password@123"
}
```
- **Response (200 OK)**: Standard authentication JSON payload. Emits `SessionTerminated_1001` WebSocket event to former device.

#### `GET /auth/me`
Fetches the currently authenticated employee profile based on JWT token.

- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "empNo": "1001",
    "firstName": "Aditya",
    "lastName": "Kadia",
    "gender": "M",
    "role": "SUPERADMIN",
    "department": "Security Management",
    "designation": "Chief Security Officer",
    "location": "Main Campus"
  }
}
```

#### `POST /auth/logout`
Terminates user session and removes active session token from server memory store.

---

### 2. Employee Master Endpoints (`/api/v1/employees`)

#### `GET /employees`
Retrieves a paginated list of employee and security guard profiles.
- **Query Parameters**: `page` (default 1), `pageSize` (default 10), `search` (name or empNo), `role`, `departmentCode`.
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "employees": [
      {
        "EmpNo": "2001",
        "FirstName": "Rajesh",
        "LastName": "Kumar",
        "Gender": "M",
        "CategoryCode": 3,
        "SecurityRole": "USER",
        "Enable": "Y",
        "department": { "DepartmentName": "Security Operations" },
        "designation": { "Designation": "Security Guard Grade I" }
      }
    ],
    "pagination": { "total": 120, "page": 1, "pageSize": 10, "totalPages": 12 }
  }
}
```

#### `GET /employees/:empNo`
Retrieves comprehensive details for a specific employee including personal and operational dates tables.

#### `POST /employees`
Creates a new guard or staff record.
- **Request Body**:
```json
{
  "empNo": "2050",
  "firstName": "Suman",
  "lastName": "Sharma",
  "gender": "F",
  "categoryCode": 3,
  "securityRole": "USER",
  "departmentCode": 1,
  "designationCode": 2,
  "locationCode": 1,
  "password": "Password@123",
  "mobile": "9876543210",
  "email": "suman.sharma@sppas-security.com"
}
```

#### `PUT /employees/:empNo`
Updates employee profile fields.

#### `DELETE /employees/:empNo`
Soft-disables (`Enable = 'N'`) or deletes an employee record.

---

### 3. Biometric Device Endpoints (`/api/v1/devices`)

#### `GET /devices`
Retrieves all registered biometric hardware terminals.
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "DeviceCode": 1,
      "DeviceName": "Main Gate Turnstile ZK",
      "DeviceSerialNo": "ZK-9948210",
      "DeviceModel": "ZKTeco K40",
      "IPAddress": "192.168.1.101",
      "PortNo": 4370,
      "CommunicationType": "TCP/IP",
      "DeviceStatus": "ONLINE",
      "LastHeartbeat": "2026-08-13T08:45:00.000Z"
    }
  ]
}
```

#### `POST /devices`
Registers a new biometric device terminal.

#### `PUT /devices/:deviceCode`
Updates connection settings (IP, port, credentials).

#### `POST /devices/:deviceCode/ping`
Initiates an instant TCP socket ping test from Node.js backend to hardware IP.

#### `POST /devices/heartbeat`
Internal API endpoint used by Python service worker threads to record heartbeat status (`{ "deviceCode": 1, "status": "ONLINE" }`).

---

### 4. Attendance Processing Endpoints (`/api/v1/attendance`)

#### `GET /attendance`
Retrieves daily attendance records.
- **Query Parameters**: `date` (YYYY-MM-DD), `shiftCode`, `status`.

#### `POST /attendance/punch`
Ingests physical biometric punches.
- **Request Body**:
```json
{
  "empNo": "2005",
  "punchDate": "2026-08-13",
  "punchTime": "08:15:00",
  "deviceCode": 1,
  "shiftCode": 1,
  "punchType": "IN"
}
```

#### `GET /attendance/pending`
Retrieves all unprocessed attendance punches (`AttendanceStatus = 'PENDING'`).

---

### 5. Guard Deployments & Allocation Endpoints (`/api/v1/deployments`)

#### `GET /deployments`
Retrieves active guard deployments for target date and shift.

#### `POST /deployments/auto-allocate`
Triggers the **2-Pass Automatic Guard Allocation Engine**.
- **Request Body**:
```json
{
  "date": "2026-08-13",
  "shiftCode": 1
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Allocated 14 guards successfully.",
  "data": { "allocatedCount": 14 }
}
```

#### `POST /deployments/override`
Manually reassigns a guard to a different duty post.
- **Request Body**:
```json
{
  "deploymentCode": 105,
  "newPostCode": 3,
  "remarks": "Reassigned to Gate 2 due to VIP arrival"
}
```

#### `GET /deployments/history/:deploymentCode`
Retrieves complete historical audit trail for a deployment.

---

### 6. Duty Posts & Post Category Endpoints (`/api/v1/posts`, `/api/v1/post-categories`)

#### `GET /posts`
Retrieves list of active duty posts sorted by priority.
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "PostCode": 1,
      "PostName": "Main Gate Entrance",
      "Priority": 1,
      "MinimumGuards": 2,
      "MaximumGuards": 4,
      "FemaleOnly": "N",
      "CriticalPost": "Y",
      "postCategory": { "PostCategoryName": "Main Entrances" }
    }
  ]
}
```

#### `POST /posts`
Creates a new duty post.

#### `PUT /posts/:postCode`
Updates post operational parameters (`MinimumGuards`, `Priority`, `CriticalPost`, `FemaleOnly`).

#### `GET /post-categories`
Retrieves post category master records.

---

### 7. Allocation Rules & Restrictions Endpoints (`/api/v1/allocation-rules`, `/api/v1/restrictions`)

#### `GET /allocation-rules`
Fetches active allocation engine rule configurations.

#### `PUT /allocation-rules/:ruleCode`
Updates active rule parameters.
- **Request Body**:
```json
{
  "criticalPostFirst": "Y",
  "skillBasedAllocation": "Y",
  "genderBasedAllocation": "Y",
  "reportingTimeBasedAllocation": "Y"
}
```

---

### 8. Dashboard Statistics & Health Endpoints (`/api/v1/dashboard`, `/api/v1/health`)

#### `GET /dashboard/statistics`
Retrieves summary metrics for command center widgets.
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "totalGuardsPresent": 42,
    "guardsAllocated": 38,
    "totalRegisteredEmployees": 150,
    "activeAlertsCount": 2,
    "devicesStatus": { "total": 6, "online": 5, "offline": 1 }
  }
}
```

#### `GET /dashboard/vacancies`
Retrieves duty post vacancy status grid data.

#### `GET /health`
System health probe returning status of API REST, Database connection pool, and WebSocket server.

---

### 9. Incident Alerts & Reports Endpoints (`/api/v1/alerts`, `/api/v1/reports`)

#### `GET /alerts`
Retrieves incident alert logs. Filters: `resolved=N`, `severity`.

#### `PUT /alerts/:alertCode/resolve`
Marks alert as resolved with supervisor remarks.
- **Request Body**:
```json
{
  "remarks": "Backup reserve guard deployed manually from control room."
}
```

#### `GET /reports/daily-allocation`
Generates daily allocation report for specified date and shift.

---

### 10. Simulation & Test Bench Endpoints (`/api/v1/simulation`)

#### `GET /simulation/unpunched-guards`
Retrieves active guards who have not punched in today.

#### `POST /simulation/simulate-punch`
Generates simulated biometric punches for testing.
- **Request Body**:
```json
{
  "empNos": ["2001", "2002", "2003"]
}
```

#### `POST /simulation/reset`
Clears today's punches, deployments, history logs, alerts, and recalculates post vacancies back to clean slate.

---

### 11. Shift Master & Access Rights Endpoints (`/api/v1/shifts`, `/api/v1/access-rights`)

#### `GET /shifts`
Retrieves shift timing master records.

#### `GET /access-rights`
Retrieves fine-grained role access permission matrix.

#### `PUT /access-rights`
Updates module permissions for a security role.

---

## End-to-End Execution Code Flows

### 1. Hardware Punch to Allocation Execution Pathway

```mermaid
sequenceDiagram
    autonumber
    actor Guard as Security Guard
    participant HW as Biometric Terminal (ZKTeco/Hikvision)
    participant PY as Python DeviceWorkerThread
    participant API as Node.js REST API (/attendance/punch)
    participant DB as MySQL Database
    participant ENG as AllocationEngine
    participant WS as Socket.IO Server
    participant UI as React Control Room Dashboard

    Guard->>HW: Scans Fingerprint / Face Match
    HW-->>PY: Hardware Event Log Captured
    PY->>PY: Check local sync cache (Deduplicate)
    PY->>API: HTTP POST /attendance/punch
    API->>DB: INSERT INTO securityattendance (Status: PENDING)
    API->>WS: Emit 'AttendanceReceived' Event
    WS-->>UI: Real-Time Card Appears in Live Punch Feed
    
    Note over API,ENG: Auto-Allocation Triggered (Scheduled or Immediate)
    
    API->>ENG: runAllocation(date, shiftCode)
    ENG->>DB: Load Allocation Rules & Priority Posts
    ENG->>DB: Load PENDING Attendances (PunchTime ASC)
    
    loop Pass 1: Minimum Required Guards Pass
        ENG->>ENG: Evaluate Constraints (Capacity < MIN, Skill, Gender)
        ENG->>DB: TRANSACTION (Create Deployment, Update Attendance -> ALLOCATED)
        ENG-->>WS: Emit 'DashboardUpdated' Event
    end

    loop Pass 2: Maximum Capacity Buffer Pass
        ENG->>ENG: Evaluate Buffer Capacity (Capacity < MAX)
        ENG->>DB: TRANSACTION (Create Deployment for remaining guards)
    end
    
    ENG->>DB: Recalculate Post Vacancies
    
    opt Critical Post Shortage Detected
        ENG->>DB: INSERT INTO securityalertlog (Severity: CRITICAL)
        ENG->>API: Trigger emailService.sendCriticalPostAlertToAdmins()
        WS-->>UI: Display Red Alert Banner
    end

    WS-->>UI: Refresh Vacancy Grid & Deployment Status
```

---

### 2. 2-Pass Guard Post Allocation Decision Flowchart

```mermaid
flowchart TD
    Start([Start Guard Allocation]) --> FetchRules[Load Active Allocation Rules & Posts]
    FetchRules --> FetchGuards[Load PENDING Attendances chronologically]
    FetchGuards --> CheckGuards{Any Pending Guards?}
    CheckGuards -- No --> End([End Allocation Cycle])
    CheckGuards -- Yes --> StartPass1[Initialize Pass 1: Target MINIMUM Capacity]

    StartPass1 --> PickGuard1[Take Next Pending Guard]
    PickGuard1 --> SortPosts1[Sort Candidate Posts: Priority ASC -> Critical DESC -> Shortage DESC]
    SortPosts1 --> EvaluatePost1[Evaluate Candidate Post]
    
    EvaluatePost1 --> CapCheck1{Current < MinimumGuards?}
    CapCheck1 -- No --> NextPost1[Try Next Candidate Post]
    CapCheck1 -- Yes --> GenderCheck1{Gender Rule Pass?}
    GenderCheck1 -- No --> NextPost1
    GenderCheck1 -- Yes --> SkillCheck1{Skill Category Match?}
    SkillCheck1 -- No --> NextPost1
    
    SkillCheck1 -- Yes --> AllocateGuard1[Execute DB Transaction:<br/>1. Create securitydeployment<br/>2. Update Attendance = ALLOCATED<br/>3. Send Email Notice]
    AllocateGuard1 --> NextGuard1{More Pending Guards?}
    NextPost1 --> MorePosts1{More Candidate Posts?}
    MorePosts1 -- Yes --> EvaluatePost1
    MorePosts1 -- No --> NextGuard1
    
    NextGuard1 -- Yes --> PickGuard1
    NextGuard1 -- No --> StartPass2[Initialize Pass 2: Target MAXIMUM Capacity]

    StartPass2 --> PickGuard2[Take Next Unassigned Guard]
    PickGuard2 --> EvaluatePost2[Evaluate Candidate Post under MAX Cap]
    EvaluatePost2 --> CapCheck2{Current < MaximumGuards?}
    CapCheck2 -- Yes --> AllocateGuard2[Allocate Guard under Buffer Pass]
    CapCheck2 -- No --> NextPost2[Try Next Candidate Post]
    AllocateGuard2 --> NextGuard2{More Unassigned Guards?}
    NextPost2 --> NextGuard2
    NextGuard2 -- Yes --> PickGuard2
    NextGuard2 -- No --> UpdateVacancies[Recalculate Post Vacancy Statistics]

    UpdateVacancies --> CheckCritical{Any Critical Post < MinimumGuards?}
    CheckCritical -- Yes --> LogCriticalAlert[Create CRITICAL Alert Log & Dispatch Email to Admins]
    CheckCritical -- No --> Complete([Allocation Cycle Finished Successfully])
    LogCriticalAlert --> Complete
```

---

### 3. Concurrent Login Single Active Session Eviction Flow

```mermaid
sequenceDiagram
    autonumber
    actor User2 as Officer (New Device B)
    actor User1 as Officer (Active Device A)
    participant API as Node.js Auth Service
    participant SS as SessionStore (In-Memory)
    participant WS as Socket.IO Server
    participant BrowserA as Device A Browser UI

    User2->>API: POST /auth/login (EmpNo: 1001)
    API->>SS: getActiveSession("1001")
    SS-->>API: Active Session Exists (SessionId_A on Device A)
    API-->>User2: HTTP 200 { isConcurrent: true, activeSession: Device A }
    
    Note over User2: User clicks "Continue & Force Logout Other Device"
    
    User2->>API: POST /auth/force-login (EmpNo: 1001)
    API->>SS: removeSession("1001")
    API->>WS: Emit 'SessionTerminated_1001'
    WS-->>BrowserA: Received 'SessionTerminated_1001' Event
    BrowserA->>BrowserA: Clear LocalStorage (Token) & Redirect to /login
    BrowserA-->>User1: Modal Notice: "Session Terminated due to login on another device"
    
    API->>SS: createSession("1001", SessionId_B, IP_B)
    API-->>User2: HTTP 200 { token: Token_B, user: Profile }
```

---

## Setup, Installation & Configuration Guide

### Prerequisites

- **Node.js**: Version 18.x or higher
- **Python**: Version 3.10 or higher
- **MySQL Database**: Version 8.0 or higher
- **Git**: Installed

---

### Environment Configuration

#### 1. Backend Environment Config (`backend/.env`)

Create `backend/.env` based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Database Connection URL
DATABASE_URL="mysql://root:password@localhost:3306/sppas_db"

# JWT Secret & Expiration
JWT_SECRET=super_secret_jwt_key_sppas_2026
JWT_EXPIRES_IN=24h

# SMTP Email Configuration (Optional - Console Mode if omitted)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="SPPAS Security Control" <no-reply@sppas-security.com>
```

#### 2. Python Service Config (`python-service/config.py`)

Verify settings in `python-service/config.py`:

```python
API_BASE_URL = "http://localhost:5000/api/v1"
POLL_INTERVAL_SECONDS = 10
DEVICE_TIMEOUT_SECONDS = 3
```

---

### Database Initialization

1. Start your local MySQL server and create the target database:
```sql
CREATE DATABASE sppas_db;
```

2. Synchronize database schema using Prisma ORM from `backend/`:
```bash
cd backend
npx prisma db push
```

3. (Optional) Seed realistic demo guards, devices, posts, and allocation rules:
```bash
# Seed default core master records
mysql -u root -p sppas_db < ../database/seed.sql

# Or generate extensive medium enterprise dataset
node ../database/seed_medium.js
```

---

### Running the Services

#### Step 1: Start Backend API Service
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

#### Step 2: Start Python Biometric Service
```bash
cd python-service
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python main.py
# Multithreaded device manager initializes and begins listening
```

#### Step 3: Start Frontend Web Application
```bash
cd frontend
npm install
npm run dev
# Vite UI runs on http://localhost:5173
```

Access the Web Application by opening `http://localhost:5173` in your browser. Default Admin Login credentials:
- **Employee No**: `1001`
- **Password**: `Password@123`

---

## Operations, Maintenance & Troubleshooting

### Common Issues & Resolutions

#### 1. Hardware Biometric Device Appears OFFLINE in Dashboard
- **Root Cause**: Firewall blocking TCP Port 4370 or incorrect IP address.
- **Resolution**:
  - Verify physical network connection: `ping <DEVICE_IP>`.
  - Ensure TCP Port 4370 (ZKTeco) or HTTP Port 80/8080 (Hikvision) is reachable.
  - Navigate to **Biometric Devices Master** (`/devices`) in SPPAS UI and click **Test Ping**.

#### 2. Hikvision Device Authentication Lockout (HTTP 401)
- **Root Cause**: Device password set in `/devices` page does not match hardware credentials, triggering Hikvision brute-force lockout.
- **Resolution**: Update the device credentials in `/devices` page with valid admin password and reboot the Hikvision hardware terminal to clear `<lockStatus>lock</lockStatus>`.

#### 3. Automatic Allocation Engine Skipping Execution
- **Root Cause**: No active Allocation Rule enabled or no pending attendance punches.
- **Resolution**:
  - Check **Allocation Rules Master** and ensure at least one rule has `Enable: 'Y'`.
  - Ensure incoming guard punches have `AttendanceStatus: 'PENDING'`.

---

### Logging & Monitoring

- **Backend Logs**: Written to standard stdout and structured via Winston Logger in `backend/src/config/logger.js`.
- **Python Service Logs**: Output to console and saved in `python-service/logs/service.log`.
- **Database Query Audit**: Set `DEBUG="prisma:query"` in `backend/.env` to inspect raw SQL transactions in real-time.

---

## License & Project Metadata

- **System Name**: Automated Security Personnel Post Allocation System (SPPAS)
- **Author**: Security Engineering Team
- **Version**: 2.4.0 (Enterprise Release)
- **License**: Proprietary Enterprise License - All Rights Reserved.
