-- ============================================================================
-- Security Personnel Post Allocation System (SPPAS) Initial Seed Script
-- Database: security_allocation
-- ============================================================================

USE `security_allocation`;

-- 1. Insert Companies
INSERT INTO `company` (`CompanyCode`, `CompanyName`, `CompanyEnable`, `CompanyType`)
VALUES 
  (1, 'Main Plant Facility', 'Y', 'PRINCIPAL'),
  (2, 'Corporate Headquarters', 'Y', 'CORPORATE'),
  (3, 'Logistics & Cargo Hub', 'Y', 'LOGISTICS')
ON DUPLICATE KEY UPDATE `CompanyName` = VALUES(`CompanyName`);

-- 2. Insert Category Master Records (4 Skill Tiers)
INSERT INTO `categorymaster` (`CategoryCode`, `CategoryName`, `GroupCategory`, `Enable`)
VALUES 
  (1, 'Un-Skilled', 'SKILL', 'Y'),
  (2, 'Semi-Skilled', 'SKILL', 'Y'),
  (3, 'Skilled', 'SKILL', 'Y'),
  (4, 'High-Skilled', 'SKILL', 'Y')
ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);

-- 3. Insert Departments
INSERT INTO `departmentmaster` (`DepartmentCode`, `DepartmentName`, `ShortDeptName`, `Enable`)
VALUES 
  (1, 'Security & Loss Prevention', 'SEC', 'Y'),
  (2, 'IT & Data Security', 'ITS', 'Y'),
  (3, 'Facilities & Logistics', 'LOG', 'Y'),
  (4, 'Executive Protection', 'EXP', 'Y')
ON DUPLICATE KEY UPDATE `DepartmentName` = VALUES(`DepartmentName`);

-- 4. Insert Designations
INSERT INTO `designationmaster` (`DesignationCode`, `Designation`, `Enable`)
VALUES 
  (1, 'Security Officer', 'Y'),
  (2, 'Security Supervisor', 'Y'),
  (3, 'Security Guard', 'Y'),
  (4, 'Lady Security Guard', 'Y')
ON DUPLICATE KEY UPDATE `Designation` = VALUES(`Designation`);

-- 5. Insert Locations
INSERT INTO `locationmaster` (`LocationCode`, `Location`, `ShortLocName`, `Enable`)
VALUES 
  (1, 'North Gate Sector', 'NGS', 'Y'),
  (2, 'South Cargo Gate', 'SCG', 'Y'),
  (3, 'Data Center Alpha', 'DCA', 'Y'),
  (4, 'Admin Tower Lobby', 'ATL', 'Y'),
  (5, 'Perimeter Zone B', 'PZB', 'Y')
ON DUPLICATE KEY UPDATE `Location` = VALUES(`Location`);

-- 6. Insert Shifts
INSERT INTO `shiftmaster` (`ShiftCode`, `Shift`, `ShiftStartTime`, `ShiftEndTime`, `ShiftAlocation_StartTime`, `ShiftAlocation_EndTime`, `Enable`)
VALUES 
  (1, 'Morning Shift (A)', '06:00:00', '14:00:00', '06:00:00', '14:00:00', 'Y'),
  (2, 'Afternoon Shift (B)', '14:00:00', '22:00:00', '14:00:00', '22:00:00', 'Y'),
  (3, 'Night Shift (C)', '22:00:00', '06:00:00', '22:00:00', '06:00:00', 'Y')
ON DUPLICATE KEY UPDATE `Shift` = VALUES(`Shift`);

-- 7. Insert Security Post Categories
INSERT INTO `securitypostcategorymaster` (`PostCategoryCode`, `PostCategoryName`, `Description`, `Enable`)
VALUES
  (1, 'Main Entrance Gates', 'Primary vehicular and pedestrian access points', 'Y'),
  (2, 'Critical Infrastructure', 'Restricted zones requiring high security authorization', 'Y'),
  (3, 'Office & Executive Receptions', 'Front desk administrative security', 'Y'),
  (4, 'Perimeter Patrol Units', 'Mobile and fixed perimeter security posts', 'Y'),
  (5, 'Cargo & Material Gates', 'Shipping, receiving, and truck inspection gates', 'Y')
ON DUPLICATE KEY UPDATE `PostCategoryName` = VALUES(`PostCategoryName`);

-- 8. Insert 15 Security Duty Posts
INSERT INTO `securitypostmaster` 
(`PostCode`, `PostName`, `PostShortName`, `PostCategoryCode`, `LocationCode`, `Priority`, `MinimumGuards`, `MaximumGuards`, `FemaleOnly`, `CriticalPost`, `Enable`)
VALUES
  (1, 'North Gate Main Entrance', 'NG-1', 1, 1, 1, 3, 5, 'N', 'Y', 'Y'),
  (2, 'North Gate Visitor Turnstile', 'NG-VT', 1, 1, 2, 2, 3, 'N', 'N', 'Y'),
  (3, 'North Gate Female Frisking Bay', 'NG-FF', 1, 1, 2, 2, 3, 'Y', 'N', 'Y'),
  (4, 'South Cargo Truck Gate', 'SC-TG', 5, 2, 1, 2, 4, 'N', 'Y', 'Y'),
  (5, 'South Weighbridge Control', 'SC-WB', 5, 2, 3, 1, 2, 'N', 'N', 'Y'),
  (6, 'Data Center Main Biometric Vault', 'DC-BV', 2, 3, 1, 2, 3, 'N', 'Y', 'Y'),
  (7, 'Data Center Server Room A', 'DC-SR', 2, 3, 2, 1, 2, 'N', 'N', 'Y'),
  (8, 'Admin Tower Ground Reception', 'AT-GR', 3, 4, 3, 2, 3, 'N', 'N', 'Y'),
  (9, 'Executive Suite Floor 5 Security', 'AT-E5', 3, 4, 2, 1, 2, 'N', 'N', 'Y'),
  (10, 'Admin Tower VIP Female Desk', 'AT-VF', 3, 4, 3, 1, 2, 'Y', 'N', 'Y'),
  (11, 'North Perimeter Watchtower 1', 'PZ-WT1', 4, 5, 2, 1, 2, 'N', 'N', 'Y'),
  (12, 'South Perimeter Mobile Patrol', 'PZ-MP2', 4, 5, 3, 2, 3, 'N', 'N', 'Y'),
  (13, 'Chemical Storage Facility Gate', 'CS-FG', 2, 1, 1, 2, 3, 'N', 'Y', 'Y'),
  (14, 'Substation & Power Plant Entry', 'PP-SE', 2, 5, 1, 1, 2, 'N', 'Y', 'Y'),
  (15, 'Staff Cafeteria Entry Checkpoint', 'SC-CP', 3, 4, 4, 1, 2, 'N', 'N', 'Y')
ON DUPLICATE KEY UPDATE `PostName` = VALUES(`PostName`), `Priority` = VALUES(`Priority`), `CriticalPost` = VALUES(`CriticalPost`);

-- 9. Insert 8 Biometric Devices
INSERT INTO `securitydevicemaster` 
(`DeviceCode`, `DeviceName`, `DeviceSerialNo`, `DeviceModel`, `IPAddress`, `PortNo`, `CommunicationType`, `LocationCode`, `DeviceStatus`, `Enable`)
VALUES
  (1, 'North Gate Main Reader A', 'ZK-NG-001', 'ZKTeco F22', '192.168.1.101', 4370, 'TCPIP', 1, 'ONLINE', 'Y'),
  (2, 'North Gate Turnstile Reader B', 'ZK-NG-002', 'ZKTeco F22', '192.168.1.102', 4370, 'TCPIP', 1, 'ONLINE', 'Y'),
  (3, 'South Cargo Gate Reader 1', 'ZK-SC-003', 'ZKTeco SpeedFace', '192.168.1.103', 4370, 'TCPIP', 2, 'ONLINE', 'Y'),
  (4, 'South Weighbridge Reader 2', 'ZK-SC-004', 'ZKTeco SpeedFace', '192.168.1.104', 4370, 'TCPIP', 2, 'ONLINE', 'Y'),
  (5, 'Data Center Access Terminal', 'ZK-DC-005', 'ZKTeco SilkFP', '192.168.1.105', 4370, 'TCPIP', 3, 'ONLINE', 'Y'),
  (6, 'Admin Lobby Main Terminal', 'ZK-AT-006', 'ZKTeco SilkFP', '192.168.1.106', 4370, 'TCPIP', 4, 'ONLINE', 'Y'),
  (7, 'Perimeter Patrol Station 1', 'ZK-PZ-007', 'ZKTeco F18', '192.168.1.107', 4370, 'TCPIP', 5, 'ONLINE', 'Y'),
  (8, 'Perimeter Patrol Station 2', 'ZK-PZ-008', 'ZKTeco F18', '192.168.1.108', 4370, 'TCPIP', 5, 'OFFLINE', 'Y')
ON DUPLICATE KEY UPDATE `DeviceName` = VALUES(`DeviceName`);

-- 10. Insert Default Allocation Rule
INSERT INTO `securityallocationrulemaster` 
(`RuleCode`, `RuleName`, `RuleDescription`, `RulePriority`, `CriticalPostFirst`, `PriorityBasedAllocation`, `ReportingTimeBasedAllocation`, `SkillBasedAllocation`, `GenderBasedAllocation`, `Enable`)
VALUES
  (1, 'Standard Operational Rule', 'Prioritizes Critical Posts, orders guards by Punch Reporting Time, matches Skill Tiers and Gender rules', 1, 'Y', 'Y', 'Y', 'Y', 'Y', 'Y')
ON DUPLICATE KEY UPDATE `RuleName` = VALUES(`RuleName`), `SkillBasedAllocation` = VALUES(`SkillBasedAllocation`);

-- 11. Insert Core Administrative Personnel (Password: 'Admin@123')
INSERT INTO `employeemaster` 
(`EmpNo`, `PunchCardNo`, `FirstName`, `LastName`, `DepartmentCode`, `DesignationCode`, `CategoryCode`, `CompanyCode`, `LocationCode`, `Gender`, `Password`, `SecurityRole`, `Enable`)
VALUES
  ('1001', 1001, 'System', 'SuperAdmin', 1, 1, 4, 1, 1, 'M', '$2a$10$W.EX5Tlj7cl6UceS1M75iuwsBRS8b2HZEsQBMDyZY4sncryoNt2I2', 'SUPERADMIN', 'Y'),
  ('1002', 1002, 'Security', 'Manager', 1, 1, 4, 1, 1, 'M', '$2a$10$W.EX5Tlj7cl6UceS1M75iuwsBRS8b2HZEsQBMDyZY4sncryoNt2I2', 'ADMIN', 'Y'),
  ('1003', 1003, 'Duty', 'Supervisor', 1, 2, 4, 1, 1, 'M', '$2a$10$W.EX5Tlj7cl6UceS1M75iuwsBRS8b2HZEsQBMDyZY4sncryoNt2I2', 'SUPERVISOR', 'Y'),
  ('1004', 1004, 'ControlRoom', 'Operator', 1, 2, 4, 1, 1, 'M', '$2a$10$W.EX5Tlj7cl6UceS1M75iuwsBRS8b2HZEsQBMDyZY4sncryoNt2I2', 'CONTROLROOM', 'Y')
ON DUPLICATE KEY UPDATE `Password` = VALUES(`Password`), `SecurityRole` = VALUES(`SecurityRole`);

-- 12. Insert Contact Details for Core Personnel
INSERT INTO `employeepersonal` (`EmpNo`, `Email`, `Mobile`)
VALUES
  ('1001', 'adikadia05@gmail.com', '9876541001'),
  ('1002', 'aditya.kadiya@payguru.in', '9876541002'),
  ('1003', 'ashish.mishra@payguru.in', '9876541003'),
  ('1004', 'operator.controlroom@sppas-security.com', '9876541004')
ON DUPLICATE KEY UPDATE `Email` = VALUES(`Email`), `Mobile` = VALUES(`Mobile`);
