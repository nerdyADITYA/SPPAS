-- ============================================================================
-- Security Personnel Post Allocation System (SPPAS) Initial Seed Script
-- Database: security_allocation
-- ============================================================================

USE `security_allocation`;

-- 1. Insert Company
INSERT INTO `company` (`CompanyCode`, `CompanyName`, `CompanyEnable`, `CompanyType`)
VALUES (1, 'Main Plant Facility', 'Y', 'PRINCIPAL')
ON DUPLICATE KEY UPDATE `CompanyName` = VALUES(`CompanyName`);

-- 2. Insert Category Master Records
INSERT INTO `categorymaster` (`CategoryCode`, `CategoryName`, `GroupCategory`, `Enable`)
VALUES 
  (1, 'Un-Skilled', 'SKILL', 'Y'),
  (2, 'Semi-Skilled', 'SKILL', 'Y'),
  (3, 'Skilled', 'SKILL', 'Y'),
  (4, 'High-Skilled', 'SKILL', 'Y')
ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);

-- 3. Insert Department
INSERT INTO `departmentmaster` (`DepartmentCode`, `DepartmentName`, `ShortDeptName`, `Enable`)
VALUES (1, 'Security & Loss Prevention', 'SEC', 'Y')
ON DUPLICATE KEY UPDATE `DepartmentName` = VALUES(`DepartmentName`);

-- 4. Insert Designations
INSERT INTO `designationmaster` (`DesignationCode`, `Designation`, `Enable`)
VALUES 
(1, 'Security Officer', 'Y'),
(2, 'Security Supervisor', 'Y'),
(3, 'Security Guard', 'Y'),
(4, 'Lady Security Guard', 'Y')
ON DUPLICATE KEY UPDATE `Designation` = VALUES(`Designation`);

-- 5. Insert Location
INSERT INTO `locationmaster` (`LocationCode`, `Location`, `ShortLocName`, `Enable`)
VALUES (1, 'Main Campus Premises', 'MCP', 'Y')
ON DUPLICATE KEY UPDATE `Location` = VALUES(`Location`);

-- 6. Insert Shifts
INSERT INTO `shiftmaster` (`ShiftCode`, `Shift`, `ShiftStartTime`, `ShiftEndTime`, `Enable`)
VALUES 
(1, 'Morning Shift (A)', '06:00:00', '14:00:00', 'Y'),
(2, 'Afternoon Shift (B)', '14:00:00', '22:00:00', 'Y'),
(3, 'Night Shift (C)', '22:00:00', '06:00:00', 'Y')
ON DUPLICATE KEY UPDATE `Shift` = VALUES(`Shift`);

-- 7. Insert Initial Employees (Passwords hashed with bcrypt for 'Admin@123' -> '$2a$10$W.EX5Tlj7cl6UceS1M75iuwsBRS8b2HZEsQBMDyZY4sncryoNt2I2')
INSERT INTO `employeemaster` 
(`EmpNo`, `PunchCardNo`, `FirstName`, `LastName`, `DepartmentCode`, `DesignationCode`, `CategoryCode`, `CompanyCode`, `LocationCode`, `Gender`, `Password`, `SecurityRole`, `Enable`)
VALUES
('1001', 1001, 'System', 'SuperAdmin', 1, 1, 1, 1, 1, 'M', '$2a$10$W.EX5Tlj7cl6UceS1M75iuwsBRS8b2HZEsQBMDyZY4sncryoNt2I2', 'SUPERADMIN', 'Y'),
('1002', 1002, 'Security', 'Manager', 1, 1, 1, 1, 1, 'M', '$2a$10$W.EX5Tlj7cl6UceS1M75iuwsBRS8b2HZEsQBMDyZY4sncryoNt2I2', 'ADMIN', 'Y'),
('1003', 1003, 'Duty', 'Supervisor', 1, 2, 1, 1, 1, 'M', '$2a$10$W.EX5Tlj7cl6UceS1M75iuwsBRS8b2HZEsQBMDyZY4sncryoNt2I2', 'SUPERVISOR', 'Y'),
('1004', 1004, 'ControlRoom', 'Operator', 1, 2, 1, 1, 1, 'M', '$2a$10$W.EX5Tlj7cl6UceS1M75iuwsBRS8b2HZEsQBMDyZY4sncryoNt2I2', 'CONTROLROOM', 'Y'),
('1005', 1005, 'John', 'Doe (Guard)', 1, 3, 1, 1, 1, 'M', '$2a$10$W.EX5Tlj7cl6UceS1M75iuwsBRS8b2HZEsQBMDyZY4sncryoNt2I2', 'USER', 'Y'),
('1006', 1006, 'Jane', 'Smith (Guard)', 1, 4, 1, 1, 1, 'F', '$2a$10$W.EX5Tlj7cl6UceS1M75iuwsBRS8b2HZEsQBMDyZY4sncryoNt2I2', 'USER', 'Y'),
('1007', 1007, 'Robert', 'Johnson (Guard)', 1, 3, 1, 1, 1, 'M', '$2a$10$W.EX5Tlj7cl6UceS1M75iuwsBRS8b2HZEsQBMDyZY4sncryoNt2I2', 'USER', 'Y'),
('1008', 1008, 'Emily', 'Davis (Guard)', 1, 4, 1, 1, 1, 'F', '$2a$10$W.EX5Tlj7cl6UceS1M75iuwsBRS8b2HZEsQBMDyZY4sncryoNt2I2', 'USER', 'Y')
ON DUPLICATE KEY UPDATE `Password` = VALUES(`Password`), `SecurityRole` = VALUES(`SecurityRole`);

-- 8. Insert Security Post Categories
INSERT INTO `securitypostcategorymaster` (`PostCategoryCode`, `PostCategoryName`, `Description`, `Enable`)
VALUES
(1, 'Main Entrance Gates', 'Critical access control points for vehicles and visitors', 'Y'),
(2, 'Internal Perimeter Patrol', 'Mobile and stationary patrol points around facility', 'Y'),
(3, 'Corporate Office Reception', 'Front desk and administrative lobby security', 'Y'),
(4, 'Server Room & Data Center', 'High-security restricted access zones', 'Y')
ON DUPLICATE KEY UPDATE `PostCategoryName` = VALUES(`PostCategoryName`);

-- 9. Insert Security Posts
INSERT INTO `securitypostmaster` 
(`PostCode`, `PostName`, `PostShortName`, `PostCategoryCode`, `LocationCode`, `Priority`, `MinimumGuards`, `MaximumGuards`, `FemaleOnly`, `CriticalPost`, `Enable`)
VALUES
(1, 'Main Gate (Gate 1)', 'MG1', 1, 1, 1, 2, 4, 'N', 'Y', 'Y'),
(2, 'Visitor Gate (Gate 2)', 'VG2', 1, 1, 2, 1, 2, 'N', 'Y', 'Y'),
(3, 'Executive Office Reception', 'EOR', 3, 1, 3, 1, 2, 'N', 'N', 'Y'),
(4, 'Ladies Frisking Point', 'LFP', 1, 1, 2, 1, 2, 'Y', 'Y', 'Y'),
(5, 'Data Center Access Door', 'DCD', 4, 1, 1, 1, 1, 'N', 'Y', 'Y')
ON DUPLICATE KEY UPDATE `PostName` = VALUES(`PostName`);

-- 10. Insert Default Allocation Rule
INSERT INTO `securityallocationrulemaster` 
(`RuleCode`, `RuleName`, `RuleDescription`, `RulePriority`, `CriticalPostFirst`, `PriorityBasedAllocation`, `ReportingTimeBasedAllocation`, `Enable`)
VALUES
(1, 'Standard Operational Rule', 'Prioritizes Critical Posts, orders guards by Punch Reporting Time, checks gender rules', 1, 'Y', 'Y', 'Y', 'Y')
ON DUPLICATE KEY UPDATE `RuleName` = VALUES(`RuleName`);

-- 11. Insert Guard Restrictions
INSERT INTO `securityguardrestrictionmaster` (`RestrictionCode`, `RestrictionName`, `Description`, `Enable`)
VALUES
(1, 'Night Shift Exempt', 'Medical exemption from night shift duty', 'Y'),
(2, 'Heavy Lifting Exempt', 'Light duty assignment only', 'Y')
ON DUPLICATE KEY UPDATE `RestrictionName` = VALUES(`RestrictionName`);

-- 12. Insert Biometric Devices
INSERT INTO `securitydevicemaster` 
(`DeviceCode`, `DeviceName`, `DeviceSerialNo`, `DeviceModel`, `IPAddress`, `PortNo`, `CommunicationType`, `LocationCode`, `DeviceStatus`, `Enable`)
VALUES
(1, 'Main Entrance Reader 1', 'ZK-MG-001', 'ZKTeco F22', '192.168.1.101', 4370, 'TCP/IP', 1, 'ONLINE', 'Y'),
(2, 'Visitor Gate Reader 2', 'ZK-VG-002', 'ZKTeco F22', '192.168.1.102', 4370, 'TCP/IP', 1, 'ONLINE', 'Y'),
(3, 'Reception Biometric Reader', 'ZK-REC-003', 'ZKTeco SilkFP', '192.168.1.103', 4370, 'TCP/IP', 1, 'ONLINE', 'Y')
ON DUPLICATE KEY UPDATE `DeviceName` = VALUES(`DeviceName`);
