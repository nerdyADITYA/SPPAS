# Automated Security Personnel Post Allocation System (SPPAS)

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5-646CFF.svg)](https://vitejs.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-v4-000000.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v6-2D3748.svg)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-4479A1.svg)](https://www.mysql.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4-010101.svg)](https://socket.io/)

An enterprise-grade, real-time **Automated Security Personnel Post Allocation System (SPPAS)** engineered for industrial facilities, manufacturing plants, commercial complexes, and high-security defense establishments.

SPPAS automates the ingestion of biometric attendance streams, evaluates security guard availability against complex post constraints (priority ranking, capacity limits, skill category matching rules, female-only frisking bay restrictions, shift timing), executes real-time guard deployment, broadcasts live WebSocket streams to control rooms, dispatches automated email alerts, and enforces role-based access control and single active session security.

---

## Table of Contents

1. [Executive Summary & System Purpose](#1-executive-summary--system-purpose)
2. [Key System Features & Capabilities](#2-key-system-features--capabilities)
3. [System Architecture & High-Level Data Flow](#3-system-architecture--high-level-data-flow)
4. [Complete Project Directory Structure](#4-complete-project-directory-structure)
5. [Database Model Schema & Prisma ORM Deep Dive](#5-database-model-schema--prisma-orm-deep-dive)
6. [Robust 2-Pass Priority-Driven Allocation Engine](#6-robust-2-pass-priority-driven-allocation-engine)
7. [SuperAdmin Dynamic Access Rights Management (RBAC)](#7-superadmin-dynamic-access-rights-management-rbac)
8. [Real-Time Control Room WebSocket Architecture](#8-real-time-control-room-websocket-architecture)
9. [Automated HTML Email Notification Subsystem](#9-automated-html-email-notification-subsystem)
10. [Single Active Session Security & Protection](#10-single-active-session-security--protection)
11. [System Audit Reports & Document Export Pipeline](#11-system-audit-reports--document-export-pipeline)
12. [Role-Based Access Control (RBAC) & Capabilities Matrix](#12-role-based-access-control-rbac--capabilities-matrix)
13. [Frontend UI/UX Architecture & Page Directory](#13-frontend-uiux-architecture--page-directory)
14. [Complete REST API Specification & Payloads](#14-complete-rest-api-specification--payloads)
15. [Database Seeding & Simulation Data Suite](#15-database-seeding--simulation-data-suite)
16. [Installation, Environment & Deployment Guide](#16-installation-environment--deployment-guide)
17. [Developer CLI Testing Suite & Troubleshooting](#17-developer-cli-testing-suite--troubleshooting)
18. [Production Maintenance & Operation Guidelines](#18-production-maintenance--operation-guidelines)

---

## 1. Executive Summary & System Purpose

Security management across large industrial premises involves coordinating dozens of duty posts, biometric terminal readers, rotational guard shifts, skill tiers, and strict physical security compliance regulations. Manual allocation of security personnel often leads to:
- Critical duty posts remaining unmanned due to absenteeism or delayed reporting.
- Human error in assigning guards with improper qualifications, skill mismatches, or gender mismatch for restricted posts.
- Lack of real-time visibility into post vacancies and guard deployment status.
- Inefficient audit trails and compliance reporting during security audits.

**SPPAS** solves these challenges by providing a fully automated, real-time control room software platform that:
- Ingests biometric check-in punches as guards arrive on site.
- Dynamically allocates available guards to duty posts based on a robust 2-pass priority matrix, capacity bounds, and skill tier rules.
- Instantly alerts control room personnel and security administrators when critical posts are unfilled.
- Dispatches automated HTML emails to guards and security executives.
- Tracks historical deployment data for auditing, compliance, and reporting.

---

## 2. Key System Features & Capabilities

- ⚙️ **Robust 2-Pass Priority-Driven Allocation Engine**:
  - **Pass 1 (Minimum Capacity Pass)**: Fulfills `MinimumGuards` required headcount across all duty posts in strict order of `Priority ASC` (Priority 1 Critical posts first). Prevents any single post from hoarding buffer guards until every reachable Critical post has met its required minimum headcount.
  - **Pass 2 (Maximum Capacity Pass)**: Allocates remaining unassigned guards to higher-priority posts up to their `MaximumGuards` buffer limit.
  - **Skill Category Guard Matching Rules**:
    - **Priority 1 (Critical Posts)**: Allocated **ONLY** to **High-Skilled** (`CategoryCode = 4`) or **Skilled** (`CategoryCode = 3`) guards.
    - **Priority 2 & 3 Posts**: Allocated **ONLY** to **Semi-Skilled** (`CategoryCode = 2`) guards.
    - **Priority 4 & 5 Posts**: Allocated **ONLY** to **Un-Skilled** (`CategoryCode = 1`) guards.
  - **Gender Restrictions**: Enforces mandatory female security restrictions (e.g. Female Frisking Bays).
- 👑 **SuperAdmin Access Rights Management Panel (`/access-rights`)**:
  - Exclusive dashboard allowing SuperAdmins to control page-level visibility (`ON` / `OFF`) and action-level permissions (`FULL_ACCESS` vs `VIEW_ONLY`) per module for all roles (`ADMIN`, `SUPERVISOR`, `CONTROLROOM`, `USER`).
  - Broadcasts real-time `AccessRightsUpdated` WebSocket notifications so permission updates reflect instantly across all active client browsers without page refresh.
- 🕒 **Shift Master Module (`/shifts`)**: Clean, read-only interface displaying all shift codes, start/end times, grace periods, and allocation windows.
- 👨‍💼 **Employee Master & Skill Category Management (`/employees`)**:
  - Interactive **Skill Category** dropdown column in the employee directory allowing live updates (`High-Skilled`, `Skilled`, `Semi-Skilled`, `Un-Skilled`).
  - Displays employee contact details (Email Address and Phone Number).
- ⚡ **Real-Time Control Room Activity Stream**: Integrated Socket.IO WebSocket pipeline broadcasting live biometric punch receipts, guard deployments, access rights updates, and dashboard metrics.
- 🎨 **Enhanced Vacancy Status Color Coding**:
  - `FULLY_ALLOCATED`: **Green Badge** (`success`)
  - `PARTIALLY_ALLOCATED`: **Yellow Badge** (`warning`)
  - `VACANT`: **Red Badge** (`error`)
- 🧪 **Advanced Interactive Simulation Suite**: 2-step simulation bar allowing batch multi-guard selection, quick female-guard shortcuts, auto-allocation triggers, and one-click data reset to a clean state.
- 📧 **Automated HTML Email Notifications**:
  - **Guard Deployment Notice**: Sent to guards upon duty post allocation containing location, post category, shift, and reporting instructions.
  - **Urgent Critical Vacancy Alert**: Dispatched to SuperAdmins & Admins when critical duty posts remain unfilled after an allocation cycle.
- 🔒 **Single Active Session Security & Protection**: Prevents simultaneous logins on the same credentials across devices, presenting an interactive **Active Session Detected** modal with force-login override and instant session revocation.
- 📊 **System Audit Reports & Document Export Pipeline**: Compliance reporting across Attendance Audit, Guard Deployments, and Vacancy History with official **PDF export** (`jspdf-autotable`), **Excel export** (`.xlsx`), and **Print Hard Copy** support.

---

## 3. System Architecture & High-Level Data Flow

```
                                    +----------------------------------+
                                    |     React 18 + Vite Frontend     |
                                    |     (Material-UI + Socket.IO)    |
                                    +-----------------+----------------+
                                                      |
                                                      | HTTP REST APIs / Socket.IO WS
                                                      v
                                    +-----------------+----------------+
                                    |     Node.js + Express Backend    |
                                    +--------+--------+-------+--------+
                                             |        |       |
                 +---------------------------+        |       +---------------------------+
                 |                                    |                                   |
                 v                                    v                                   v
  +--------------+-------------+    +-----------------+---------------+    +--------------+--------------+
  |  2-Pass Allocation Engine  |    |  Prisma ORM (MySQL Database)  |    |  Nodemailer Email Service    |
  |  - Minimum & Maximum Passes|    |  - employeemaster / category  |    |  - Guard Allocation Email    |
  |  - Skill Category Rules    |    |  - securitypostmaster         |    |  - Admin Urgent Vacancy Alert|
  |  - Gender & Priority Rules |    |  - securityattendance / deploy|    +------------------------------+
  +----------------------------+    +---------------------------------+
```

### High-Level Data Flow Steps:
1. **Biometric Punch Ingestion**: A guard checks in at a biometric terminal (or simulated punch reader). A `securityattendance` record is generated with status `PENDING`.
2. **WebSocket Broadcast**: Socket.IO server emits `AttendanceReceived` and `DashboardUpdated` events to all connected Control Room dashboards.
3. **Allocation Engine Execution**:
   - **Pass 1**: Fulfills `MinimumGuards` across posts in `Priority ASC` order, matching guard skill categories (`High-Skilled`/`Skilled` for Priority 1, `Semi-Skilled` for Priority 2/3, `Un-Skilled` for Priority 4/5).
   - **Pass 2**: Allocates remaining guards up to `MaximumGuards` buffer limits.
4. **Transaction & Notification**: Creates `securitydeployment` and `securitydeploymenthistory` records in a Prisma transaction, updates attendance status to `ALLOCATED`, and dispatches email notifications.

---

## 4. Complete Project Directory Structure

```
Automated Security Personnel Post Allocation System/
├── README.md                          # Project Documentation
├── database/
│   ├── init.sql                       # MySQL DDL Database Schema Initializer
│   ├── seed.sql                       # MySQL Initial Data Seed
│   └── seed_medium.js                 # 50-Employee & Multi-Post Dataset Seeder
├── backend/
│   ├── package.json                   # Backend Dependencies & Scripts
│   ├── prisma/
│   │   └── schema.prisma              # Prisma ORM Database Models & Relations
│   ├── data/
│   │   └── access_rights.json         # Persistent SuperAdmin Access Rights Matrix
│   ├── src/
│   │   ├── app.js                     # Express Application Core
│   │   ├── server.js                  # HTTP & Socket.IO Server Entry
│   │   ├── allocation/
│   │   │   └── AllocationEngine.js    # Robust 2-Pass Priority & Skill Allocation Engine
│   │   ├── config/
│   │   │   ├── logger.js              # Winston Logging Configuration
│   │   │   └── prisma.js              # Prisma Client Instance Connection
│   │   ├── constants/
│   │   │   └── roles.js               # Role Constants (SUPERADMIN, ADMIN, SUPERVISOR, CONTROLROOM, USER)
│   │   ├── controllers/               # Express Request Controllers
│   │   │   ├── accessRightsController.js
│   │   │   ├── alertController.js
│   │   │   ├── attendanceController.js
│   │   │   ├── authController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── deploymentController.js
│   │   │   ├── deviceController.js
│   │   │   ├── employeeController.js
│   │   │   ├── postController.js
│   │   │   ├── reportController.js
│   │   │   ├── shiftController.js
│   │   │   └── simulationController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js      # Auth, JWT, Active Session & checkModuleAccess Middleware
│   │   │   └── errorHandler.js        # Global Error Handling Middleware
│   │   ├── repositories/              # Prisma Data Access Layer Repositories
│   │   │   ├── AccessRightsRepository.js
│   │   │   ├── AlertRepository.js
│   │   │   ├── AttendanceRepository.js
│   │   │   ├── DeploymentRepository.js
│   │   │   ├── DeviceRepository.js
│   │   │   ├── EmployeeRepository.js
│   │   │   ├── PostRepository.js
│   │   │   ├── ShiftRepository.js
│   │   │   └── VacancyRepository.js
│   │   ├── routes/                    # API Endpoints Router Definitions
│   │   │   ├── accessRightsRoutes.js
│   │   │   ├── alertRoutes.js
│   │   │   ├── attendanceRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── deploymentRoutes.js
│   │   │   ├── deviceRoutes.js
│   │   │   ├── employeeRoutes.js
│   │   │   ├── postRoutes.js
│   │   │   ├── reportRoutes.js
│   │   │   ├── shiftRoutes.js
│   │   │   └── simulationRoutes.js
│   │   ├── services/                  # Business Logic Services
│   │   │   ├── AccessRightsService.js
│   │   │   ├── ShiftService.js
│   │   │   └── emailService.js
│   │   ├── utils/
│   │   │   ├── SessionStore.js        # In-Memory Active Session Store
│   │   │   └── apiResponse.js         # Standard API Response Helper
│   │   └── websocket/
│   │       └── socketServer.js        # Socket.IO Connection & Event Emitter
└── frontend/
    ├── package.json                   # Frontend React Dependencies
    ├── vite.config.js                 # Vite Bundler & Server Config
    ├── src/
    │   ├── App.jsx                    # Main Application Component & Router
    │   ├── index.css                  # Global CSS Design Tokens & Styling
    │   ├── main.jsx                   # React Application Entry
    │   ├── components/                # Reusable UI Components
    │   ├── contexts/
    │   │   ├── AccessRightsContext.jsx# Dynamic Page & Mutate Authorization Context
    │   │   ├── AuthContext.jsx        # Auth State & Session Management
    │   │   └── GuideContext.jsx       # Contextual Module Guidance Toggle
    │   ├── layouts/
    │   │   └── AppLayout.jsx          # Dynamic Navigation Drawer & Header Bar
    │   ├── pages/
    │   │   ├── AccessRightsPage.jsx   # SuperAdmin Access Rights Management Page
    │   │   ├── AlertsPage.jsx         # System Alerts & Resolution Page
    │   │   ├── AttendancePage.jsx     # Attendance Stream & Punch Logs Page
    │   │   ├── DashboardPage.jsx      # Control Room & Simulation Page
    │   │   ├── DeploymentPage.jsx     # Post Deployments & Manual Allocation Page
    │   │   ├── DevicesPage.jsx        # Biometric Devices Master Page
    │   │   ├── EmployeesPage.jsx      # Employees Directory & Skill Category Page
    │   │   ├── LoginPage.jsx          # Login & Role Credentials Guide Page
    │   │   ├── PostsPage.jsx          # Duty Post Master Page
    │   │   ├── ReportsPage.jsx        # Audit Reports Page (PDF & Excel Export)
    │   │   └── ShiftMasterPage.jsx    # Read-Only Shift Master Table Page
    │   └── services/
    │       ├── api.js                 # Axios HTTP Client Instance
    │       └── socket.js              # Socket.IO Client Connection Manager
```

---

## 5. Database Model Schema & Prisma ORM Deep Dive

The database schema consists of 12 relational tables defined in [`backend/prisma/schema.prisma`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/prisma/schema.prisma).

### 1. `employeemaster`
Primary employee table containing identity, security roles, and skill categories.
```prisma
model employeemaster {
  EmpNo                String          @id @db.VarChar(20)
  PunchCardNo          Int?
  FirstName            String?         @db.VarChar(50)
  MiddleName           String?         @default("") @db.VarChar(50)
  LastName             String?         @default("") @db.VarChar(50)
  Gender               String?         @db.VarChar(1)
  CategoryCode         Int?            @db.SmallInt
  SecurityRole         SecurityRole    @default(USER)
  Enable               String?         @default("Y") @db.Char(1)
  CreatedDateTime      DateTime        @default(now()) @db.Timestamp(0)

  category             categorymaster? @relation(fields: [CategoryCode], references: [CategoryCode])
  personal             employeepersonal?
  attendance           securityattendance[]
  deployments          securitydeployment[] @relation("GuardDeployments")
}
```

### 2. `categorymaster`
Master table for employee skill tiers.
```prisma
model categorymaster {
  CategoryCode         Int             @id @default(autoincrement()) @db.UnsignedTinyInt
  CategoryName         String?         @db.VarChar(100)
  GroupCategory        String?         @db.VarChar(20)
  Enable               String?         @default("N") @db.Char(1)

  employees            employeemaster[]
}
```
*Standardized Records*:
- `1`: **Un-Skilled**
- `2`: **Semi-Skilled**
- `3`: **Skilled**
- `4`: **High-Skilled**

### 3. `securitypostmaster`
Master definition of security duty posts.
```prisma
model securitypostmaster {
  PostCode             Int            @id @default(autoincrement()) @db.UnsignedSmallInt
  PostName             String         @unique @db.VarChar(100)
  PostShortName        String?        @db.VarChar(20)
  PostCategoryCode     Int            @db.UnsignedSmallInt
  LocationCode         Int?           @db.UnsignedSmallInt
  Priority             Int            @default(1) @db.UnsignedSmallInt
  MinimumGuards        Int            @default(1) @db.UnsignedTinyInt
  MaximumGuards        Int            @default(1) @db.UnsignedTinyInt
  FemaleOnly           EnableFlag?    @default(N)
  CriticalPost         EnableFlag?    @default(N)
  Enable               EnableFlag?    @default(Y)

  postCategory         securitypostcategorymaster @relation(fields: [PostCategoryCode], references: [PostCategoryCode])
}
```
*Priority & Critical Rule*: Priority 1 posts automatically carry `CriticalPost = 'Y'`; Priority > 1 posts carry `CriticalPost = 'N'`.

### 4. `shiftmaster`
Master table defining shift schedules, grace periods, and allocation windows.

---

## 6. Robust 2-Pass Priority-Driven Allocation Engine

The allocation algorithm in [`backend/src/allocation/AllocationEngine.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/allocation/AllocationEngine.js) executes via `runAllocation(dateStr, shiftCode)`:

```
[Start Allocation Cycle]
        |
        v
Load Active Allocation Rules & Active Duty Posts (Priority ASC)
        |
        v
Fetch Pending Attendance Records (PunchTime ASC)
        |
        v
+-------------------------------------------------------------+
| PASS 1: Minimum Capacity Pass                               |
| Iterate through pending attendances and allocate to posts   |
| where currentCount < MinimumGuards matching Skill Tier Rules|
+-------------------------------------------------------------+
        |
        v
+-------------------------------------------------------------+
| PASS 2: Maximum Capacity Pass                               |
| Iterate through remaining unassigned guards and allocate to |
| higher-priority posts up to MaximumGuards buffer limits     |
+-------------------------------------------------------------+
        |
        v
Execute Prisma $transaction & Dispatch Email Notifications
        |
        v
Update Vacancy Statistics Table & Log Critical Post Alerts
        |
        v
[Complete Allocation Cycle]
```

### Skill Category Matching Matrix:
- **Priority 1 (Critical Posts)**: Allocated **ONLY** to **High-Skilled** (`CategoryCode = 4`) or **Skilled** (`CategoryCode = 3`) guards.
- **Priority 2 & 3 Posts**: Allocated **ONLY** to **Semi-Skilled** (`CategoryCode = 2`) guards.
- **Priority 4 & 5 Posts**: Allocated **ONLY** to **Un-Skilled** (`CategoryCode = 1`) guards.

---

## 7. SuperAdmin Dynamic Access Rights Management (RBAC)

SuperAdmins can configure permissions live on the [`/access-rights`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/frontend/src/pages/AccessRightsPage.jsx) page.

### Capabilities Controlled per Module & Role:
1. **Page Access Switch (`ON` / `OFF`)**: Enables or completely hides access to a module (e.g. `devices`, `posts`, `deployments`, `reports`, `employees`, `shifts`).
2. **Action Authorization (`FULL_ACCESS` vs `VIEW_ONLY`)**:
   - `FULL_ACCESS`: Allows creating, editing, and deleting records.
   - `VIEW_ONLY`: Hides action buttons (e.g. "Register Biometric Reader", "Add New Duty Post") and blocks mutating HTTP requests (`POST`, `PUT`, `DELETE`, `PATCH`).

### Real-Time Sync:
When permissions are saved, the backend broadcasts `AccessRightsUpdated` via Socket.IO, updating all connected client interfaces without forcing page reloads.

---

## 8. Real-Time Control Room WebSocket Architecture

Managed by [`backend/src/websocket/socketServer.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/websocket/socketServer.js):

- `AttendanceReceived`: Broadcasts live biometric punches to control room dashboards.
- `AllocationCreated`: Broadcasts post deployment notifications.
- `DashboardUpdated`: Triggers dashboard statistic refreshes.
- `AccessRightsUpdated`: Broadcasts real-time role permission updates to client browsers.
- `SessionTerminated_[EmpNo]`: Notifies a client when their session is overridden by a login on another device.

---

## 9. Automated HTML Email Notification Subsystem

Managed by [`backend/src/services/emailService.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/services/emailService.js) using Nodemailer:

- **Guard Deployment Notice**: Sent to guards upon assignment with post name, location sector, category, shift timing, and supervisor instructions.
- **Urgent Critical Vacancy Alert**: Dispatched to SuperAdmins & Admins when critical duty posts remain understaffed after an allocation cycle.

---

## 10. Single Active Session Security & Protection

Implemented in [`SessionStore.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/utils/SessionStore.js) and `authMiddleware.js`:
- Prevents concurrent logins using the same credentials across different devices.
- Displays an **Active Session Detected** modal dialog with a **Force Login** option.
- Handles backend server restarts gracefully without dropping valid signed JWT sessions.

---

## 11. System Audit Reports & Document Export Pipeline

Located in [`ReportsPage.jsx`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/frontend/src/pages/ReportsPage.jsx):
- **Biometric Attendance Audit**: Detailed punch logs with device reader codes and punch types.
- **Guard Post Deployment Audit**: Historical post allocation logs with shift codes and allocation methods.
- **Duty Post Vacancy History**: Unfilled duty post capacity across historical date ranges.
- **Exports**: **PDF Document** (`jspdf-autotable`), **Excel Spreadsheet** (`.xlsx`), and **Print Hard Copy**.

---

## 12. Role-Based Access Control (RBAC) & Capabilities Matrix

| Feature / Module | SUPERADMIN (1001) | ADMIN (1002) | SUPERVISOR (1003) | CONTROLROOM (1004) | USER / Guard (1005) |
| --- | :---: | :---: | :---: | :---: | :---: |
| **Control Room Dashboard** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Simulation Bar (Punch & Reset)** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Auto-Allocation Engine Execution** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Biometric Attendance Stream** | ✅ | ✅ | ✅ | ✅ | 👤 (Own Only) |
| **Guard Post Deployments** | ✅ | Dynamic | Dynamic | Dynamic | 👤 (Own Only) |
| **Duty Post Master Data** | ✅ | Dynamic | Dynamic | Dynamic | ❌ |
| **Biometric Device Master** | ✅ | Dynamic | Dynamic | Dynamic | ❌ |
| **Shift Master Page** | ✅ | Dynamic | Dynamic | Dynamic | ❌ |
| **Employee & Skill Category Master** | ✅ | Dynamic | ❌ | ❌ | ❌ |
| **Access Rights Control Panel** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Critical Vacancy Email Alerts** | ✅ | ✅ | ❌ | ❌ | ❌ |

*(Note: "Dynamic" permissions are controlled live by the SuperAdmin via `/access-rights`).*

---

## 13. Frontend UI/UX Architecture & Page Directory

Built with React 18, Material-UI v5, and a dark mode aesthetic:

1. `LoginPage.jsx`: Authentication, credentials guide, and concurrent session warning modal.
2. `DashboardPage.jsx`: Control room KPIs, simulation bar, vacancy status table, and live activity drawer.
3. `AttendancePage.jsx`: Biometric attendance logs and date filtering.
4. `DeploymentPage.jsx`: Guard deployments and manual allocation dialog.
5. `PostsPage.jsx`: Duty post master (Priority 1-5 dropdown, automatic Critical indicator, capacity bounds).
6. `DevicesPage.jsx`: Biometric reader terminal management.
7. `AlertsPage.jsx`: Security exception and critical vacancy alert center.
8. `ReportsPage.jsx`: Audit reports with PDF, Excel, and Print exports.
9. `EmployeesPage.jsx`: Employee directory, contact info, and interactive Skill Category dropdown.
10. `AccessRightsPage.jsx`: SuperAdmin role-based access rights control dashboard.
11. `ShiftMasterPage.jsx`: Read-only table view for shift schedules and timings.

---

## 14. Complete REST API Specification & Payloads

Base URL: `http://localhost:5000/api/v1`

### Authentication Endpoints
- `POST /auth/login`
- `POST /auth/force-login`

### Control Room & Simulation Endpoints
- `GET /dashboard/summary`
- `POST /simulation/punch`
- `POST /simulation/reset`

### Guard Deployment & Allocation Endpoints
- `POST /deployments/allocate`
- `GET /deployments`

### Access Rights Management Endpoints (SuperAdmin Only)
- `GET /access-rights/my-permissions`
- `GET /access-rights`
- `PUT /access-rights`

### Employee Master Endpoints
- `GET /employees`
- `PATCH /employees/:empNo/category`

### Shift Master Endpoints
- `GET /shifts`

---

## 15. Database Seeding & Simulation Data Suite

Located in [`database/seed_medium.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/database/seed_medium.js):
- **50 Employees**: Distributed across 4 Skill Categories (`High-Skilled`, `Skilled`, `Semi-Skilled`, `Un-Skilled`) and roles.
- **4 Category Master Records**: `Un-Skilled` (1), `Semi-Skilled` (2), `Skilled` (3), `High-Skilled` (4).
- **15 Security Duty Posts**: Prioritized from Priority 1 (Critical) to Priority 5.
- **8 Biometric Device Readers**: Mapped to plant locations.

To seed database:
```bash
cd backend
node ../database/seed_medium.js
```

---

## 16. Installation, Environment & Deployment Guide

### Prerequisites
- Node.js v18.0+
- MySQL 8.0+
- npm v9+

### Setup Instructions:
1. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```
2. **Configure `backend/.env`**:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="mysql://root:password@localhost:3306/security_allocation"
   JWT_SECRET="sppas_super_secret_jwt_key_2026_production_ready"
   CORS_ORIGIN="http://localhost:5173"
   ```
3. **Generate Prisma Client & Seed DB**:
   ```bash
   npx prisma generate
   node ../database/seed_medium.js
   ```
4. **Start Servers**:
   ```bash
   # Terminal 1 (Backend)
   cd backend && npm run dev

   # Terminal 2 (Frontend)
   cd frontend && npm run dev
   ```
5. **Access Portal**: Open `http://localhost:5173/login`.

---

## 17. Developer CLI Testing Suite & Troubleshooting

Run quick automated test scripts from `backend/`:

### Test Auto-Allocation Cycle:
```bash
node -e "async function test() { const engine = require('./src/allocation/AllocationEngine'); const res = await engine.runAllocation(new Date().toISOString().split('T')[0], 1); console.log(res); } test();"
```

---

## 18. Production Maintenance & Operation Guidelines

- **Winston Logs**: Application activity logged to `logs/combined.log` and runtime exceptions to `logs/error.log`.
- **Database Backups**: Schedule automated daily dumps of the `security_allocation` MySQL database.
- **Device Heartbeat Monitoring**: Readers inactive for >10 minutes automatically transition to `OFFLINE` status via `cronJobs.js`.

---

## License

This software is proprietary and confidential. All rights reserved. Developed for corporate automated security operations.
