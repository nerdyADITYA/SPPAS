# Automated Security Personnel Post Allocation System (SPPAS)

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5-646CFF.svg)](https://vitejs.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-v4-000000.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v6-2D3748.svg)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-4479A1.svg)](https://www.mysql.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4-010101.svg)](https://socket.io/)

An enterprise-grade, real-time **Automated Security Personnel Post Allocation System (SPPAS)** engineered for industrial facilities, manufacturing plants, commercial complexes, and high-security defense establishments.

SPPAS automates the ingestion of biometric attendance streams, evaluates security guard availability against complex post constraints (priority ranking, capacity limits, female-only frisking bay rules, shift timing), executes real-time guard deployment, broadcasts live WebSocket streams to control rooms, dispatches automated email alerts, and enforces single active session security.

---

## Table of Contents

1. [Executive Summary & System Purpose](#1-executive-summary--system-purpose)
2. [Key System Features & Capabilities](#2-key-system-features--capabilities)
3. [System Architecture & High-Level Data Flow](#3-system-architecture--high-level-data-flow)
4. [Complete Project Directory Structure](#4-complete-project-directory-structure)
5. [Database Model Schema & Prisma ORM Deep Dive](#5-database-model-schema--prisma-orm-deep-dive)
6. [Automatic Allocation Engine Blueprint](#6-automatic-allocation-engine-blueprint)
7. [Real-Time Control Room WebSocket Architecture](#7-real-time-control-room-websocket-architecture)
8. [Automated HTML Email Notification Subsystem](#8-automated-html-email-notification-subsystem)
9. [Single Active Session Security & Protection](#9-single-active-session-security--protection)
10. [System Audit Reports & Document Export Pipeline](#10-system-audit-reports--document-export-pipeline)
11. [Role-Based Access Control (RBAC) & Capabilities Matrix](#11-role-based-access-control-rbac--capabilities-matrix)
12. [Frontend UI/UX Architecture & Page Directory](#12-frontend-uiux-architecture--page-directory)
13. [Complete REST API Specification & Payloads](#13-complete-rest-api-specification--payloads)
14. [Database Seeding & Simulation Data Suite](#14-database-seeding--simulation-data-suite)
15. [Installation, Environment & Deployment Guide](#15-installation-environment--deployment-guide)
16. [Developer CLI Testing Suite & Troubleshooting](#16-developer-cli-testing-suite--troubleshooting)
17. [Production Maintenance & Operation Guidelines](#17-production-maintenance--operation-guidelines)

---

## 1. Executive Summary & System Purpose

Security management across large industrial premises involves coordinating dozens of duty posts, biometric terminal readers, rotational guard shifts, and strict physical security compliance regulations. Manual allocation of security personnel often leads to:
- Critical duty posts remaining unmanned due to absenteeism or delayed reporting.
- Human error in assigning guards with improper qualifications or gender mismatch for restricted posts.
- Lack of real-time visibility into post vacancies and guard deployment status.
- Inefficient audit trails and compliance reporting during security audits.

**SPPAS** solves these challenges by providing a fully automated, real-time control room software platform that:
- Ingests biometric check-in punches as guards arrive on site.
- Dynamically allocates available guards to duty posts based on priority matrix and operational rules.
- Instantly alerts control room personnel and security administrators when critical posts are unfilled.
- Dispatches automated HTML emails to guards and security executives.
- Tracks historical deployment data for auditing, compliance, and reporting.

---

## 2. Key System Features & Capabilities

- ⚙️ **Automatic Guard Allocation Engine**: Constraint-driven allocation algorithm prioritizing Critical Posts, post capacity limits, priority rankings, shift timings, and gender-restricted posts (e.g. Female Frisking Bays).
- ⚡ **Real-Time Control Room Activity Stream**: Integrated Socket.IO WebSocket pipeline broadcasting live biometric punch receipts, guard deployments, and dashboard metrics.
- 🧪 **Advanced Interactive Simulation Suite**: 2-step simulation bar allowing batch multi-guard selection, quick female-guard shortcuts, auto-allocation triggers, and one-click data reset to a clean state.
- 📧 **Automated HTML Email Notifications**:
  - **Guard Deployment Notice**: Sent to guards upon duty post allocation containing location, post category, shift, and reporting instructions.
  - **Urgent Critical Vacancy Alert**: Dispatched to SuperAdmins & Admins when critical duty posts remain unfilled after an allocation cycle.
- 🔒 **Single Active Session & Concurrent Protection**: Prevents simultaneous logins on the same credentials across devices, presenting an interactive **Active Session Detected** modal with force-login override and instant session revocation.
- 📊 **System Audit & Operational Reports**: Full-featured compliance reporting across Attendance Audit, Guard Deployments, and Vacancy History with official **PDF export** (`jspdf-autotable`), **Excel export** (`.xlsx`), and **Print Hard Copy** support.
- 💡 **Interactive Contextual Guidance System**: Global **Module Guide (ON/OFF)** toggle rendering instructional banners across all 8 web application pages.
- 🔑 **Interactive Role & Credentials Guide**: Embedded login page guide detailing credentials, passwords, and explicit permission scopes for all 5 system roles (`SUPERADMIN`, `ADMIN`, `SUPERVISOR`, `CONTROLROOM`, `USER`).

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
  |  Allocation Engine         |    |  Prisma ORM (MySQL Database)  |    |  Nodemailer Email Service    |
  |  - Priority Rules          |    |  - employeemaster / personal  |    |  - Guard Allocation Email    |
  |  - Capacity Checks         |    |  - securitypostmaster         |    |  - Admin Urgent Vacancy Alert|
  |  - Gender Constraints      |    |  - securityattendance / deploy|    +------------------------------+
  +----------------------------+    +---------------------------------+
```

### High-Level Data Flow Steps:
1. **Biometric Punch Ingestion**: A guard checks in at a biometric terminal (or simulated punch reader). A `securityattendance` record is generated with status `PENDING`.
2. **WebSocket Broadcast**: Socket.IO server emits `AttendanceReceived` and `DashboardUpdated` events to all connected Control Room dashboards.
3. **Allocation Engine Execution**:
   - Fetches pending attendances and active posts ordered by `CriticalPost DESC` and `Priority ASC`.
   - Matches guards to posts adhering to capacity limits and gender restrictions.
   - Creates `securitydeployment` and `securitydeploymenthistory` records in a single database transaction.
   - Updates `securityattendance` status to `ALLOCATED`.
4. **Automated Notification**:
   - Triggers `emailService.sendGuardDeploymentEmail` to notify the guard of their duty post.
   - If Critical Posts remain unfilled, logs a `securityalertlog` entry and triggers `emailService.sendCriticalPostAlertToAdmins`.
5. **Dashboard Refresh**: Socket.IO broadcasts `AllocationCreated` and `DashboardUpdated` to update control room statistics.

---

## 4. Complete Project Directory Structure

```
Automated Security Personnel Post Allocation System/
├── README.md                          # Root Developer Documentation
├── database/
│   ├── schema.sql                     # Raw SQL Database DDL Schema
│   └── seed_medium.js                 # Medium-scale demo database seeder
├── backend/
│   ├── .env                           # Environment Variables (Ignored in Git)
│   ├── .env.example                   # Environment Variables Template
│   ├── package.json                   # Backend Node Dependencies & Scripts
│   ├── prisma/
│   │   └── schema.prisma              # Prisma ORM Data Models & Database Mapping
│   └── src/
│       ├── server.js                  # Application Entry Point & Express Server
│       ├── allocation/
│       │   └── AllocationEngine.js    # Core Guard Allocation Algorithm
│       ├── config/
│       │   ├── logger.js              # Winston Logger Configuration
│       │   └── prisma.js              # Prisma Client Instance
│       ├── constants/
│       │   ├── messages.js            # Standard System Message Strings
│       │   └── roles.js               # RBAC Role Constants
│       ├── controllers/
│       │   ├── alertController.js     # System Alerts REST Controller
│       │   ├── allocationRuleController.js
│       │   ├── attendanceController.js # Biometric Attendance Controller
│       │   ├── authController.js      # Auth & Concurrent Session Controller
│       │   ├── dashboardController.js  # Control Room Summary Controller
│       │   ├── deploymentController.js # Guard Deployments Controller
│       │   ├── deviceController.js    # Biometric Devices Controller
│       │   ├── employeeController.js  # Employees & RBAC Controller
│       │   ├── postCategoryController.js
│       │   ├── postController.js      # Duty Post Master Controller
│       │   ├── reportController.js    # System Audit Reports Controller
│       │   ├── restrictionController.js
│       │   └── simulationController.js# Multi-Guard Punch & Reset Controller
│       ├── middleware/
│       │   ├── authMiddleware.js      # JWT & Session Verification Middleware
│       │   ├── errorHandler.js        # Global Express Error Handler
│       │   ├── requestLogger.js       # HTTP Request Audit Logger
│       │   └── validationMiddleware.js# Express Validator Middleware
│       ├── repositories/
│       │   ├── AlertRepository.js     # Alerts Database Access Layer
│       │   ├── AttendanceRepository.js# Attendance Database Access Layer
│       │   ├── AuthRepository.js       # Auth Database Access Layer
│       │   ├── DeploymentRepository.js# Deployments Database Access Layer
│       │   ├── DeviceRepository.js    # Device Database Access Layer
│       │   ├── EmployeeRepository.js  # Employee Database Access Layer
│       │   ├── PostRepository.js      # Duty Post Database Access Layer
│       │   └── VacancyRepository.js   # Vacancy Database Access Layer
│       ├── routes/
│       │   ├── alertRoutes.js
│       │   ├── allocationRuleRoutes.js
│       │   ├── attendanceRoutes.js
│       │   ├── authRoutes.js
│       │   ├── dashboardRoutes.js
│       │   ├── deploymentRoutes.js
│       │   ├── deviceRoutes.js
│       │   ├── employeeRoutes.js
│       │   ├── healthRoutes.js
│       │   ├── index.js               # Central API Router Index (/api/v1)
│       │   ├── postCategoryRoutes.js
│       │   ├── postRoutes.js
│       │   ├── reportRoutes.js
│       │   ├── restrictionRoutes.js
│       │   └── simulationRoutes.js
│       ├── scheduler/
│       │   └── cronJobs.js            # Node-Cron Device Health & Vacancy Jobs
│       ├── services/
│       │   ├── AlertService.js
│       │   ├── AttendanceService.js
│       │   ├── AuthService.js         # Session & Auth Business Logic
│       │   ├── DeploymentService.js
│       │   ├── EmployeeService.js
│       │   ├── PostService.js
│       │   └── emailService.js        # Nodemailer HTML Email Dispatch Service
│       ├── utils/
│       │   ├── SessionStore.js        # Active Session Registry & Expiry Store
│       │   ├── apiResponse.js         # Standard API Response Helper
│       │   ├── jwt.js                 # JWT Token Signing & Verification
│       │   └── password.js            # Bcrypt Password Hashing Helper
│       ├── validators/
│       │   ├── authValidator.js
│       │   ├── employeeValidator.js
│       │   └── postValidator.js
│       └── websocket/
│           └── socketServer.js        # Socket.IO Real-Time Server Setup
└── frontend/
    ├── package.json                   # Frontend React Dependencies
    ├── vite.config.js                 # Vite Bundler & Server Config
    ├── src/
    │   ├── App.jsx                    # Main Application Component & Routes
    │   ├── index.css                  # Global CSS Design Tokens & Styling
    │   ├── main.jsx                   # React Application Entry
    │   ├── components/                # Reusable UI Components
    │   ├── contexts/
    │   │   ├── AuthContext.jsx        # Auth State & Session Management
    │   │   └── GuideContext.jsx       # Contextual Module Guidance Toggle
    │   ├── layouts/
    │   │   └── AppLayout.jsx          # Sidebar Drawer & Header App Bar Layout
    │   ├── pages/
    │   │   ├── AlertsPage.jsx         # System Alerts & Resolution Page
    │   │   ├── AttendancePage.jsx     # Attendance Stream & Punch Logs Page
    │   │   ├── DashboardPage.jsx      # Control Room & Simulation Page
    │   │   ├── DeploymentPage.jsx     # Post Deployments & Manual Allocation
    │   │   ├── DevicesPage.jsx        # Biometric Devices Master Page
    │   │   ├── EmployeesPage.jsx      # Employees & RBAC Management Page
    │   │   ├── LoginPage.jsx          # Login & Role Credentials Guide Page
    │   │   ├── PostsPage.jsx          # Duty Post Master Page
    │   │   └── ReportsPage.jsx        # Audit Reports (PDF & Excel Export) Page
    │   └── services/
    │       ├── api.js                 # Axios HTTP Client Instance
    │       └── socket.js              # Socket.IO Client Connection Manager
```

---

## 5. Database Model Schema & Prisma ORM Deep Dive

The database architecture consists of 11 relational tables defined in [`backend/prisma/schema.prisma`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/prisma/schema.prisma).

### 1. `employeemaster`
Primary employee table containing core identity and security role assignments.
```prisma
model employeemaster {
  EmpNo                String      @id @db.VarChar(20)
  PunchCardNo          Int?
  FirstName            String?     @db.VarChar(50)
  MiddleName           String?     @default("") @db.VarChar(50)
  LastName             String?     @default("") @db.VarChar(50)
  Gender               String?     @default("M") @db.Char(1)
  SecurityRole         String      @default("USER") @db.VarChar(20)
  Enable               String?     @default("Y") @db.Char(1)
  CreatedDateTime      DateTime    @default(now()) @db.Timestamp(0)
  
  personal             employeepersonal?
  attendance           securityattendance[]
  deployments          securitydeployment[] @relation("GuardDeployments")
}
```

### 2. `employeepersonal`
Personal contact details linked to `employeemaster` via 1-to-1 cascade.
```prisma
model employeepersonal {
  EmpNo                String    @id @db.VarChar(20)
  Email                String?   @db.VarChar(150)
  PhoneNo              String?   @db.VarChar(20)
  Mobile               String?   @db.VarChar(15)
  PermanentAddress     String?   @db.VarChar(255)
  CurrentAddress       String?   @db.VarChar(255)
  
  employee             employeemaster @relation(fields: [EmpNo], references: [EmpNo], onDelete: Cascade)
}
```

### 3. `securitypostmaster`
Master definition of security duty posts.
```prisma
model securitypostmaster {
  PostCode             Int        @id @default(autoincrement()) @db.UnsignedSmallInt
  PostName             String     @unique @db.VarChar(100)
  PostCategoryCode     Int        @db.UnsignedSmallInt
  LocationCode         Int        @db.UnsignedSmallInt
  MinimumGuards        Int        @default(1) @db.UnsignedSmallInt
  MaximumGuards        Int        @default(1) @db.UnsignedSmallInt
  Priority             Int        @default(1) @db.UnsignedSmallInt
  CriticalPost         EnableFlag @default(N)
  FemaleOnly           EnableFlag @default(N)
  Enable               EnableFlag @default(Y)
  
  postCategory         securitypostcategorymaster @relation(fields: [PostCategoryCode], references: [PostCategoryCode])
  location             locationmaster             @relation(fields: [LocationCode], references: [LocationCode])
}
```

### 4. `securitypostcategorymaster`
Categorization of duty posts (`Main Entrances`, `Critical Infrastructure`, `Perimeter Gates`, `Administrative`).

### 5. `securityattendance`
Biometric punch logs recorded from readers or simulation.
```prisma
model securityattendance {
  AttendanceCode       BigInt          @id @default(autoincrement()) @db.UnsignedBigInt
  EmpNo                String          @db.VarChar(20)
  DeviceCode           Int             @db.UnsignedSmallInt
  PunchDate            DateTime        @db.Date
  PunchTime            DateTime        @db.Time(0)
  PunchDateTime        DateTime        @db.DateTime
  PunchType            EnumPunchType   @default(IN)
  AttendanceStatus     EnumAttStatus   @default(PENDING)
  Remarks              String?         @db.VarChar(255)
  
  employee             employeemaster  @relation(fields: [EmpNo], references: [EmpNo])
  device               securitydevicemaster @relation(fields: [DeviceCode], references: [DeviceCode])
}
```

### 6. `securitydeployment`
Active guard duty post deployment records.
```prisma
model securitydeployment {
  DeploymentCode       BigInt          @id @default(autoincrement()) @db.UnsignedBigInt
  DeploymentDate       DateTime        @db.Date
  EmpNo                String          @db.VarChar(20)
  PostCode             Int             @db.UnsignedSmallInt
  ShiftCode            Int             @db.UnsignedSmallInt
  ReportingTime        DateTime?       @db.DateTime
  AllocationMethod     EnumMethod      @default(AUTO)
  DeploymentStatus     EnumDepStatus   @default(ALLOCATED)
  
  employee             employeemaster  @relation("GuardDeployments", fields: [EmpNo], references: [EmpNo])
  post                 securitypostmaster @relation(fields: [PostCode], references: [PostCode])
}
```

### 7. `securitydeploymenthistory`
Complete audit log trail tracking all guard deployment modifications, replacements, and manual overrides.

### 8. `securitypostvacancy`
Daily vacancy metrics per post, shift, and date (`RequiredGuards`, `AllocatedGuards`, `VacantGuards`, `Status`: `'VACANT'`, `'PARTIAL'`, `'FILLED'`).

### 9. `securitydevicemaster`
Biometric device terminal configuration (`DeviceCode`, `DeviceName`, `IPAddress`, `LocationCode`, `Status`: `'ONLINE'`, `'OFFLINE'`, `LastHeartbeat`).

### 10. `securityalertlog`
System alert log repository (`AlertCode`, `AlertType`, `Severity`: `'CRITICAL'`, `'WARNING'`, `'INFO'`, `AlertMessage`, `Resolved`: `'Y'`/`'N'`).

### 11. `securityallocationrulemaster`
Configurable rules governing engine logic (`RulePriority`, `GenderBasedAllocation`, `SeniorityWeight`, `Enable`).

---

## 6. Automatic Allocation Engine Blueprint

The allocation algorithm in [`backend/src/allocation/AllocationEngine.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/allocation/AllocationEngine.js) executes via `runAllocation(dateStr, shiftCode)`:

```
[Start Allocation Cycle]
        |
        v
Load Active Allocation Rules from DB
        |
        v
Load Active Posts (Order: CriticalPost DESC, Priority ASC)
        |
        v
Fetch Pending Attendance Records for Shift (PunchTime ASC)
        |
        v
For Each Guard in Pending List:
        |
        +---> Is Guard already deployed today? ---> [Yes] ---> Skip Guard
        |
        v [No]
Find Eligible Vacant Post:
        |
        +---> Is Post at Maximum Guard Capacity? ---> [Yes] ---> Check Next Post
        |
        v [No]
        +---> Is Post FemaleOnly & Guard Male? ------> [Yes] ---> Check Next Post
        |
        v [No]
[MATCH FOUND: Post Selected]
        |
        v
Execute Prisma $transaction:
  - Create securitydeployment
  - Create securitydeploymenthistory
  - Update securityattendance status = 'ALLOCATED'
        |
        v
Trigger Asynchronous Email to Guard
        |
        v
Next Guard in Loop
        |
        v
Update Vacancy Statistics Table
        |
        v
Check Critical Post Vacancies:
  - If Vacant > 0: Log securityalertlog + Send Urgent Email Alert to SuperAdmins & Admins
        |
        v
[Complete Allocation Cycle]
```

---

## 7. Real-Time Control Room WebSocket Architecture

SPPAS uses Socket.IO ([`backend/src/websocket/socketServer.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/websocket/socketServer.js)) to provide real-time updates to Control Room dashboards without page refreshes.

### WebSocket Events & Payloads:

#### 1. `AttendanceReceived` (Server -> Client)
Emitted immediately when a biometric punch is recorded (simulated or real reader).
```json
{
  "EmpNo": "1005",
  "GuardName": "Alexander Smith",
  "Gender": "M",
  "Time": "10:15:30"
}
```

#### 2. `AllocationCreated` (Server -> Client)
Emitted when a guard is deployed to a post.
```json
{
  "EmpNo": "1005",
  "GuardName": "Alexander Smith",
  "PostName": "Main Entrance Gate A",
  "ShiftCode": 1
}
```

#### 3. `DashboardUpdated` (Server -> Client)
Triggers all connected client dashboards to re-fetch statistics and vacancy tables.

#### 4. `SessionTerminated_[EmpNo]` (Server -> Specific Client)
Emitted to a specific employee's active browser window when a Force Login occurs on another device.
```json
{
  "empNo": "1001",
  "message": "Your active session was terminated because a login occurred on another device."
}
```

---

## 8. Automated HTML Email Notification Subsystem

Managed by [`backend/src/services/emailService.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/services/emailService.js) using Nodemailer.

### Email Templates:

#### A. Guard Deployment Notice
Dispatched to the allocated guard's email (fetched from `employeepersonal.Email`).
- **Header**: Branded dark letterhead (*SPPAS Security Duty Post Allocation Notice*).
- **Body Table**: Guard Name, EmpNo, Assigned Post Name, Post Category, Location Sector, Shift Name, Reporting Time, and Supervisor Remarks.
- **Badge**: Red `CRITICAL` tag if assigned to a critical post.

#### B. Urgent Critical Vacancy Alert
Dispatched to all active `SUPERADMIN` and `ADMIN` email addresses when critical posts remain unfilled after allocation.
- **Header**: Red Alert Letterhead (🚨 *URGENT: Critical Security Post Vacancy Alert*).
- **Summary Table**: List of unfilled critical posts, location sector, required guards, allocated count, and vacancy shortage.
- **Action Notice**: Instructs management to log into the SPPAS Portal and deploy reserve guards manually.

---

## 9. Single Active Session Security & Protection

Implemented in [`backend/src/utils/SessionStore.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/utils/SessionStore.js) and [`backend/src/controllers/authController.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/backend/src/controllers/authController.js).

### Workflow:
1. **Login Request**: User submits credentials to `POST /api/v1/auth/login`.
2. **Session Check**: Backend queries `SessionStore.getActiveSession(empNo)`.
3. **If Session Active**:
   - Returns HTTP 200 OK with `code: 'CONCURRENT_LOGIN_DETECTED'` and active session details (IP Address, Login Time).
   - Frontend displays the **Active Session Detected** modal dialog.
4. **Force Login Override**:
   - If the user clicks **Force Login & Logout Other**, frontend submits to `POST /api/v1/auth/force-login`.
   - Backend revokes the previous session, emits `SessionTerminated_[EmpNo]` via Socket.IO, registers the new session ID in `SessionStore`, and issues a new JWT.
   - The previous browser window is instantly logged out.
5. **Inactivity Expiry**: Sessions automatically expire after **15 minutes of inactivity**.

---

## 10. System Audit Reports & Document Export Pipeline

Located in [`frontend/src/pages/ReportsPage.jsx`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/frontend/src/pages/ReportsPage.jsx).

### Available Reports:
- **Biometric Attendance Audit**: Detailed punch logs with terminal timestamps, device reader codes, and punch types.
- **Guard Post Deployment Audit**: Historical post allocation logs with supervisor names, shift codes, and allocation methods.
- **Duty Post Vacancy History**: Tracks unfilled duty post capacity across historical date ranges.

### Export Pipeline Features:
- 📄 **Official PDF Document (`jspdf` + `jspdf-autotable`)**: Generates styled PDF files with letterhead branding, metadata block, dark table headers, alternating row shading, confidential footers, and page numbers (`Page X of Y`).
- 📊 **Excel Spreadsheet (`.xlsx` / SheetJS)**: Exports structured Excel workbooks with clean data headers and date/time formatting.
- 🖨️ **Print Hard Copy (`window.print()`)**: Formats data for physical paper printers using `@media print` rules that hide sidebars and action buttons.

---

## 11. Role-Based Access Control (RBAC) & Capabilities Matrix

| Feature / Module | SUPERADMIN (1001) | ADMIN (1002) | SUPERVISOR (1003) | CONTROLROOM (1004) | USER / Guard (1005) |
| --- | :---: | :---: | :---: | :---: | :---: |
| **Control Room Dashboard** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Simulation Bar (Punch & Reset)** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Auto-Allocation Engine Execution** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Biometric Attendance Stream** | ✅ | ✅ | ✅ | ✅ | 👤 (Own Only) |
| **Guard Post Deployments** | ✅ | ✅ | ✅ | 👁️ (View Only) | 👤 (Own Only) |
| **Manual Guard Deployment** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Duty Post Master Data** | ✅ | ✅ | 👁️ (View Only) | 👁️ (View Only) | ❌ |
| **Biometric Device Master** | ✅ | ✅ | 👁️ (View Only) | 👁️ (View Only) | ❌ |
| **Alert Log & Resolution** | ✅ | ✅ | ✅ | 👁️ (View Only) | ❌ |
| **Audit Reports & Exports** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Employee & RBAC Management** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Allocation Rule Configuration** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Critical Vacancy Email Alerts** | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 12. Frontend UI/UX Architecture & Page Directory

Built with React 18, Material-UI v5, and a sleek Dark Mode glassmorphic aesthetic.

### Page Directory:

1. **`LoginPage.jsx`**:
   - Glassmorphic card login form.
   - Role-Based Access Credentials & Capabilities Guide panel.
   - One-click **Auto-Fill** chips for quick role testing.
   - **Active Session Detected** concurrent login warning modal.

2. **`DashboardPage.jsx`**:
   - Key operational metric cards (Active Guards, Today Deployed, Vacancies, Online Devices).
   - Interactive Simulation Bar: Multi-guard select dropdown, quick female guard punch, auto-allocation trigger, and reset simulation button.
   - Duty post vacancy table & critical alert cards.
   - Real-Time Control Room Activity Stream drawer (Socket.IO logs).

3. **`AttendancePage.jsx`**: Biometric punch stream log with date filtering and punch type tags.
4. **`DeploymentPage.jsx`**: Guard post deployment master table with Manual Guard Deployment modal dialog.
5. **`PostsPage.jsx`**: Duty post master configuration (Capacity limits, Priority ranking, CriticalPost flag, FemaleOnly restriction).
6. **`DevicesPage.jsx`**: Biometric reader terminal management and IP address status.
7. **`AlertsPage.jsx`**: Critical security alert center with resolve action buttons.
8. **`ReportsPage.jsx`**: Audit report generator with **Export to PDF**, **Export to Excel**, and **Print Hard Copy** buttons.
9. **`EmployeesPage.jsx`**: Employee directory, contact details, and RBAC security role assignments (SuperAdmin restricted).

---

## 13. Complete REST API Specification & Payloads

Base URL: `http://localhost:5000/api/v1`

### 1. Authentication Endpoints

#### `POST /auth/login`
- **Request Body**:
  ```json
  {
    "empNo": "1001",
    "password": "Admin@123"
  }
  ```
- **Response (Success - Single Session)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      "user": {
        "empNo": "1001",
        "firstName": "System",
        "lastName": "SuperAdmin",
        "role": "SUPERADMIN"
      }
    }
  }
  ```
- **Response (Concurrent Session Detected)**:
  ```json
  {
    "success": false,
    "code": "CONCURRENT_LOGIN_DETECTED",
    "message": "Employee #1001 (System SuperAdmin) is currently logged in on another device.",
    "data": {
      "isConcurrent": true,
      "activeSession": {
        "ipAddress": "127.0.0.1",
        "loginTime": "2026-07-28T10:15:00.000Z"
      }
    }
  }
  ```

#### `POST /auth/force-login`
- **Request Body**:
  ```json
  {
    "empNo": "1001",
    "password": "Admin@123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Force login successful. Other session terminated.",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      "user": {
        "empNo": "1001",
        "role": "SUPERADMIN"
      }
    }
  }
  ```

---

### 2. Control Room Dashboard Endpoints

#### `GET /dashboard/summary`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "totalGuardsPresent": 15,
      "guardsAllocated": 12,
      "totalRegisteredEmployees": 50,
      "activeAlertsCount": 2,
      "devicesStatus": {
        "total": 8,
        "online": 6,
        "offline": 2
      }
    }
  }
  ```

---

### 3. Simulation Engine Endpoints

#### `POST /simulation/punch`
- **Request Body (Batch Punch)**:
  ```json
  {
    "empNos": ["1005", "1008", "1010"]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Biometric IN Punches recorded for 3 Guards (Alexander Smith (#1005), Abigail Brown (#1008), Marcus Aurelius (#1010)). Status: PENDING allocation.",
    "data": {
      "count": 3,
      "punches": [...]
    }
  }
  ```

#### `POST /simulation/reset`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Today's attendance and guard allocations reset successfully to clean slate!"
  }
  ```

---

### 4. Guard Deployment Endpoints

#### `POST /deployments/allocate`
- **Request Body**:
  ```json
  {
    "date": "2026-07-28",
    "shiftCode": 1
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Allocated 12 guards successfully.",
    "data": {
      "allocatedCount": 12
    }
  }
  ```

---

## 14. Database Seeding & Simulation Data Suite

Located in [`database/seed_medium.js`](file:///c:/My%20Stuff/Office%20Work/Automated%20Security%20Personnel%20Post%20Allocation%20System/database/seed_medium.js).

### Data Seeded:
- **50 Employees**: Including SuperAdmins (`1001`), Admins (`1002`), Supervisors (`1003`), Operators (`1004`), and 46 Security Guards (`1005` to `1050`) with male/female distribution and email addresses.
- **4 Post Categories**: Main Entrances, Critical Infrastructure, Perimeter Gates, Administrative.
- **15 Security Duty Posts**: Main Entrance Gate A (Critical), North Gate Female Frisking Bay (Female Only), Data Center Vault (Critical), Perimeter Watch Tower 1, Administrative Block, Substation Gate, Raw Material Gate, etc.
- **8 Biometric Device Readers**: Reader terminals mapped to plant sectors.
- **1 Active Allocation Rule**: Priority & Gender Enforcement enabled.

To seed database:
```bash
cd backend
node ../database/seed_medium.js
```

---

## 15. Installation, Environment & Deployment Guide

### Prerequisites
- Node.js v18.0+
- MySQL 8.0+
- npm v9+

### Step-by-Step Installation:

1. **Clone/Navigate to Project**:
   ```bash
   cd "Automated Security Personnel Post Allocation System"
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**:
   Create `backend/.env` file:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="mysql://root:password@localhost:3306/security_allocation"
   JWT_SECRET="sppas_super_secret_jwt_key_2026_production_ready"
   JWT_EXPIRES_IN="24h"
   CORS_ORIGIN="http://localhost:5173"
   LOG_LEVEL="info"

   # SMTP Credentials for Email Notifications
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   EMAIL_FROM="SPPAS Guard Allocation System <no-reply@sppas-security.com>"
   ```

4. **Prisma Generation & Database Seed**:
   ```bash
   npx prisma generate
   node ../database/seed_medium.js
   ```

5. **Start Backend Server**:
   ```bash
   npm run dev
   ```

6. **Frontend Setup**:
   In a new terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

7. **Access Application**:
   Open browser at `http://localhost:5173/login`.

---

## 16. Developer CLI Testing Suite & Troubleshooting

Run quick automated simulation tests from `backend/`:

### 1. Test Batch Multi-Guard Punch
```bash
node -e "async function test() { const token = (await (await fetch('http://localhost:5000/api/v1/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ empNo: '1001', password: 'Admin@123' }) })).json()).data.token; const res = await (await fetch('http://localhost:5000/api/v1/simulation/punch', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ empNos: ['1005', '1008', '1010'] }) })).json(); console.log(res.message); } test();"
```

### 2. Test Auto-Allocation Engine Execution
```bash
node -e "async function test() { const token = (await (await fetch('http://localhost:5000/api/v1/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ empNo: '1001', password: 'Admin@123' }) })).json()).data.token; const res = await (await fetch('http://localhost:5000/api/v1/deployments/allocate', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ shiftCode: 1 }) })).json(); console.log(res.message); } test();"
```

### 3. Test Simulation Reset (Clean Slate)
```bash
node -e "async function test() { const token = (await (await fetch('http://localhost:5000/api/v1/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ empNo: '1001', password: 'Admin@123' }) })).json()).data.token; const res = await (await fetch('http://localhost:5000/api/v1/simulation/reset', { method: 'POST', headers: { Authorization: 'Bearer ' + token } })).json(); console.log(res.message); } test();"
```

---

## 17. Production Maintenance & Operation Guidelines

- **Log File Rotation**: Winston logs application events to `logs/combined.log` and runtime errors to `logs/error.log`. Inspect error logs periodically.
- **Database Backup**: Schedule regular database dumps of the MySQL `security_allocation` database.
- **Biometric Reader Maintenance**: Biometric readers automatically transition to `OFFLINE` if no heartbeat punch is received within 10 minutes (managed by `cronJobs.js`).

---

## License

This software is proprietary and confidential. All rights reserved. Developed for corporate automated security operations.
