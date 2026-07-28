-- ============================================================================
-- Security Personnel Post Allocation System (SPPAS) Database Schema Definition
-- Database Name: security_allocation
-- Engine: InnoDB | Character Set: utf8 | Collation: utf8_general_ci
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `security_allocation` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `security_allocation`;

-- ----------------------------------------------------------------------------
-- 1. Core Master Tables (Cloned / Created for Standalone Operation)
-- ----------------------------------------------------------------------------

-- Company Master
CREATE TABLE IF NOT EXISTS `company` (
  `CompanyCode` SMALLINT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `PrincipalCompany` VARCHAR(100) DEFAULT NULL,
  `PrincipalCompanyCode` VARCHAR(255) DEFAULT NULL,
  `VendorCode` VARCHAR(20) DEFAULT NULL,
  `CompanyName` VARCHAR(100) DEFAULT '',
  `CompanyAddress` VARCHAR(255) DEFAULT NULL,
  `EstablishmentCode` VARCHAR(100) DEFAULT NULL COMMENT 'Company PF No.',
  `SalesTaxNo` VARCHAR(100) DEFAULT NULL,
  `ExciseNo` VARCHAR(100) DEFAULT NULL,
  `PanNo` VARCHAR(100) DEFAULT NULL,
  `SiteLocationPlant` VARCHAR(100) DEFAULT NULL,
  `Phone` VARCHAR(30) DEFAULT NULL,
  `Fax` VARCHAR(100) DEFAULT NULL,
  `Email` VARCHAR(100) DEFAULT '',
  `webpage` VARCHAR(100) DEFAULT '',
  `Prefix_EmpNo` VARCHAR(10) DEFAULT NULL,
  `JobNature` VARCHAR(100) DEFAULT '',
  `ResponsiblePersonName` VARCHAR(100) DEFAULT '',
  `ResponsibleRelation` VARCHAR(100) DEFAULT '',
  `ResponsibleAddress` VARCHAR(255) DEFAULT '',
  `ResponsiblePhone` VARCHAR(50) DEFAULT '',
  `ResponsibleEmail` VARCHAR(100) DEFAULT '',
  `OwnerName` VARCHAR(100) DEFAULT '',
  `OwnerAddress` VARCHAR(255) DEFAULT '',
  `OwnerPhone` VARCHAR(50) DEFAULT '',
  `OwnerEmail` VARCHAR(100) DEFAULT '',
  `LicenseFrom` DATE DEFAULT NULL,
  `LicenseTo` DATE DEFAULT NULL,
  `LicenseNo` VARCHAR(50) DEFAULT NULL,
  `WorkerCover` SMALLINT(5) UNSIGNED DEFAULT NULL,
  `LWF` VARCHAR(100) DEFAULT '',
  `WCPolicyFrom` DATE DEFAULT NULL,
  `WCPolicyTo` DATE DEFAULT NULL,
  `wcPolicyNo` VARCHAR(100) DEFAULT NULL,
  `WCWorkerCover` SMALLINT(5) UNSIGNED DEFAULT NULL,
  `EnablePortal` ENUM('N','Y') DEFAULT 'N',
  `CompanyValidate` ENUM('Y','N') DEFAULT 'N',
  `CompanyValidateBy` VARCHAR(100) DEFAULT NULL,
  `CompanyValidateDateTime` DATETIME DEFAULT NULL,
  `CompanyEnable` VARCHAR(1) DEFAULT NULL,
  `CompanyType` VARCHAR(15) DEFAULT NULL,
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDateTime` DATETIME DEFAULT NULL,
  `PCResponsiblePersonName` VARCHAR(100) DEFAULT '' COMMENT 'Parent Company Responsible Person',
  `PCResponsibleAddress` VARCHAR(100) DEFAULT '',
  `PCResponsiblePhone` VARCHAR(100) DEFAULT '',
  `PCResponsibleEmail` VARCHAR(100) DEFAULT '',
  `shopEstno` VARCHAR(100) DEFAULT '',
  `MSMEno` VARCHAR(100) DEFAULT '',
  `ValidFrom` DATE DEFAULT NULL,
  `ValidTo` DATE DEFAULT NULL,
  `PTaxNo` VARCHAR(100) DEFAULT '',
  PRIMARY KEY (`CompanyCode`),
  UNIQUE KEY `company_companyCode` (`CompanyCode`) USING BTREE,
  KEY `CompanyName` (`CompanyName`),
  KEY `VendorCode` (`VendorCode`),
  KEY `PanNo` (`PanNo`),
  KEY `CompanyEnable` (`CompanyEnable`),
  KEY `JobNature` (`JobNature`),
  KEY `EnablePortal` (`EnablePortal`),
  KEY `CompanyType` (`CompanyType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Category Master
CREATE TABLE IF NOT EXISTS `categorymaster` (
  `CategoryCode` TINYINT(3) UNSIGNED NOT NULL AUTO_INCREMENT,
  `CategoryName` VARCHAR(100) DEFAULT NULL,
  `Statutory` VARCHAR(25) DEFAULT NULL,
  `GroupCategory` VARCHAR(20) DEFAULT NULL,
  `WeeklyOffApplicable` CHAR(1) DEFAULT NULL,
  `PaidHolidayApplicable` CHAR(1) DEFAULT NULL,
  `OverTimeApplicable` CHAR(1) DEFAULT NULL,
  `OverTimeQuarterlyLimit` DECIMAL(5,2) UNSIGNED DEFAULT 0.00,
  `OverTimeMonthlyLimit` DECIMAL(5,2) UNSIGNED DEFAULT 0.00,
  `OverTimeWeeklyLimit` DECIMAL(5,2) UNSIGNED DEFAULT 0.00,
  `DailyWagesApplicable` CHAR(1) DEFAULT NULL,
  `SalaryMonthDay` TINYINT(3) UNSIGNED DEFAULT NULL,
  `LeaveCoverAllow` ENUM('Y','N') DEFAULT 'N',
  `LeaveCoverAbsentee` ENUM('Y','N') DEFAULT 'N',
  `Enable` CHAR(1) DEFAULT 'N',
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDateTime` DATETIME DEFAULT NULL,
  `ResponsiblePersonName` TEXT DEFAULT '',
  `ResponsibleAddress` TEXT DEFAULT '',
  `ResponsiblePhone` TEXT DEFAULT '',
  `ResponsibleEmail` TEXT DEFAULT '',
  PRIMARY KEY (`CategoryCode`),
  UNIQUE KEY `CategoryCode` (`CategoryCode`) USING BTREE,
  KEY `CategoryName` (`CategoryName`),
  KEY `WeeklyOffApplicable` (`WeeklyOffApplicable`),
  KEY `PaidHolidayApplicable` (`PaidHolidayApplicable`),
  KEY `OverTimeApplicable` (`OverTimeApplicable`),
  KEY `Enable` (`Enable`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Department Master
CREATE TABLE IF NOT EXISTS `departmentmaster` (
  `DepartmentCode` SMALLINT(3) UNSIGNED NOT NULL AUTO_INCREMENT,
  `DepartmentName` VARCHAR(100) DEFAULT NULL,
  `ShortDeptName` VARCHAR(10) DEFAULT NULL,
  `Statutory` VARCHAR(25) DEFAULT NULL,
  `Department_Type` VARCHAR(25) DEFAULT NULL,
  `Enable` ENUM('Y','N') DEFAULT 'Y',
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDateTime` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `ResponsiblePersonName` VARCHAR(100) DEFAULT '',
  `ResponsibleAddress` VARCHAR(255) DEFAULT '',
  `ResponsiblePhone` VARCHAR(50) DEFAULT '',
  `ResponsibleEmail` VARCHAR(100) DEFAULT '',
  PRIMARY KEY (`DepartmentCode`),
  UNIQUE KEY `pk_deptcode` (`DepartmentCode`) USING BTREE,
  UNIQUE KEY `DepartmentName` (`DepartmentName`,`Statutory`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Designation Master
CREATE TABLE IF NOT EXISTS `designationmaster` (
  `DesignationCode` SMALLINT(3) UNSIGNED NOT NULL AUTO_INCREMENT,
  `Designation` VARCHAR(100) DEFAULT NULL,
  `Enable` ENUM('Y','N') DEFAULT 'Y',
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDateTime` DATETIME DEFAULT NULL,
  PRIMARY KEY (`DesignationCode`),
  UNIQUE KEY `DesignationCode` (`DesignationCode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Location Master
CREATE TABLE IF NOT EXISTS `locationmaster` (
  `LocationCode` SMALLINT(2) UNSIGNED NOT NULL AUTO_INCREMENT,
  `Location` VARCHAR(100) DEFAULT NULL,
  `ShortLocName` VARCHAR(10) DEFAULT NULL,
  `Enable` ENUM('Y','N') DEFAULT 'Y',
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDateTime` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `ResponsiblePersonName` VARCHAR(100) DEFAULT '',
  `ResponsibleAddress` VARCHAR(255) DEFAULT '',
  `ResponsiblePhone` VARCHAR(50) DEFAULT '',
  `ResponsibleEmail` VARCHAR(100) DEFAULT '',
  PRIMARY KEY (`LocationCode`),
  UNIQUE KEY `LocationCode` (`LocationCode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Shift Master
CREATE TABLE IF NOT EXISTS `shiftmaster` (
  `ShiftCode` TINYINT(4) UNSIGNED NOT NULL AUTO_INCREMENT,
  `Shift` VARCHAR(25) DEFAULT NULL,
  `Statutory` VARCHAR(25) DEFAULT NULL,
  `FullDayHrs` TIME DEFAULT NULL,
  `HalfDayHrs` TIME DEFAULT NULL,
  `LunchHrs` TIME DEFAULT NULL,
  `ShiftStartTime` TIME DEFAULT NULL,
  `ShiftEndTime` TIME DEFAULT NULL,
  `GraceAfterShiftStart` TIME DEFAULT NULL,
  `GraceBeforeShiftEnd` TIME DEFAULT NULL,
  `GraceForWorkedStatus` TIME DEFAULT '00:00:00',
  `GraceForMeal` TIME DEFAULT NULL,
  `OTBeforeShiftStart` TIME DEFAULT NULL,
  `OTAfterShiftEnd` TIME DEFAULT NULL,
  `OtMinHours` TIME NOT NULL DEFAULT '00:00:00',
  `OTRound` TINYINT(3) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'can go upto 59 mins',
  `Rotation` CHAR(1) NOT NULL DEFAULT 'N',
  `ShiftAlocation_StartTime` TIME DEFAULT NULL,
  `ShiftAlocation_EndTime` TIME DEFAULT NULL,
  `ShiftAlocation_PunchBreak` TIME DEFAULT NULL,
  `Enable` CHAR(1) DEFAULT 'Y',
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDateTime` DATETIME DEFAULT NULL,
  `Consider_MinMax` ENUM('Y','N') NOT NULL DEFAULT 'Y',
  `ShiftStartTime_OTStart` ENUM('Y','N') NOT NULL DEFAULT 'N',
  `ShiftStartTime_WorkStart` ENUM('Y','N') NOT NULL DEFAULT 'N',
  `Ignore_Holiday` ENUM('Y','N') NOT NULL DEFAULT 'N',
  `Ignore_WeekOff` ENUM('Y','N') NOT NULL DEFAULT 'N',
  PRIMARY KEY (`ShiftCode`),
  UNIQUE KEY `ShiftCode` (`ShiftCode`) USING BTREE,
  KEY `Shift` (`Shift`),
  KEY `Statutory` (`Statutory`),
  KEY `Enable` (`Enable`),
  KEY `ShiftStartTime` (`ShiftStartTime`),
  KEY `ShiftEndTime` (`ShiftEndTime`),
  KEY `FullDayHrs` (`FullDayHrs`),
  KEY `HalfDayHrs` (`HalfDayHrs`),
  KEY `GraceForWorkedStatus` (`GraceForWorkedStatus`),
  KEY `ShiftAlocation_StartTime` (`ShiftAlocation_StartTime`),
  KEY `ShiftAlocation_EndTime` (`ShiftAlocation_EndTime`),
  KEY `ShiftAlocation_PunchBreak` (`ShiftAlocation_PunchBreak`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Employee Master (with SecurityRole for RBAC)
CREATE TABLE IF NOT EXISTS `employeemaster` (
  `EmpNo` VARCHAR(20) NOT NULL COMMENT 'Employee No.',
  `PunchCardNo` INT(11) DEFAULT NULL COMMENT 'PunchCardNo',
  `FirstName` VARCHAR(50) DEFAULT NULL COMMENT 'First Name',
  `MiddleName` VARCHAR(50) DEFAULT '',
  `LastName` VARCHAR(50) DEFAULT '',
  `PrincipalCompanyCode` INT(11) DEFAULT NULL,
  `DepartmentCode` SMALLINT(3) UNSIGNED DEFAULT NULL COMMENT 'Department',
  `SubDepartmentCode` SMALLINT(6) DEFAULT NULL,
  `SectionCode` SMALLINT(3) DEFAULT NULL,
  `DesignationCode` SMALLINT(3) UNSIGNED DEFAULT NULL COMMENT 'Designation',
  `CategoryCode` SMALLINT(3) DEFAULT NULL COMMENT 'Category',
  `CompanyCode` SMALLINT(2) DEFAULT NULL COMMENT 'Company',
  `LocationCode` SMALLINT(3) DEFAULT NULL COMMENT 'Location',
  `McCode` SMALLINT(2) DEFAULT NULL COMMENT 'Main Cost Center',
  `ScCode` SMALLINT(2) DEFAULT NULL COMMENT 'Sub Cost Center',
  `UnitCode` INT(11) DEFAULT NULL,
  `SubUnitCode` INT(11) DEFAULT NULL,
  `JobNature` VARCHAR(100) DEFAULT NULL,
  `Status` VARCHAR(20) DEFAULT NULL,
  `Confirm` VARCHAR(1) DEFAULT NULL COMMENT 'Confirm',
  `Gender` VARCHAR(1) DEFAULT NULL COMMENT 'Gender',
  `BloodGroup` VARCHAR(10) DEFAULT NULL COMMENT 'BloodGroup',
  `PfNo` VARCHAR(30) DEFAULT NULL COMMENT 'PF No',
  `EsiNo` VARCHAR(20) DEFAULT NULL COMMENT 'ESI No',
  `PanCardNo` VARCHAR(20) DEFAULT NULL,
  `BankAcNo` VARCHAR(30) DEFAULT NULL COMMENT 'Bank Account No',
  `PaymentMode` VARCHAR(6) DEFAULT NULL COMMENT 'Payment Mode',
  `BankCode` TINYINT(3) UNSIGNED DEFAULT NULL COMMENT 'Bank',
  `EmployeeGrade` VARCHAR(5) DEFAULT NULL COMMENT 'Employee Grade',
  `EmpLevel` VARCHAR(50) DEFAULT NULL,
  `PositionTitle` VARCHAR(200) DEFAULT NULL,
  `Accomodation` VARCHAR(1) DEFAULT NULL,
  `EmpType` VARCHAR(25) DEFAULT NULL COMMENT 'Employee Type',
  `Production` VARCHAR(1) DEFAULT NULL COMMENT 'Production',
  `LocalEmp` VARCHAR(1) DEFAULT NULL COMMENT 'Local Employee',
  `EmpGroup` VARCHAR(50) DEFAULT NULL COMMENT 'Employee Group',
  `ESI_Applicable` VARCHAR(3) DEFAULT NULL COMMENT 'ESI Applicable',
  `ESI_Deduct` VARCHAR(3) DEFAULT NULL COMMENT 'ESI Deduct',
  `RecoveryEmp` DECIMAL(10,2) DEFAULT NULL COMMENT 'Recovery Employee',
  `LicID` VARCHAR(20) DEFAULT NULL COMMENT 'Lic ID',
  `Password` TINYBLOB DEFAULT NULL COMMENT 'Password',
  `SecurityRole` ENUM('SUPERADMIN','ADMIN','SUPERVISOR','CONTROLROOM','USER') DEFAULT 'USER',
  `Email_OTP_Enabled` ENUM('Y','N') DEFAULT 'N',
  `Email_OTP` VARCHAR(10) DEFAULT NULL,
  `Email_OTP_DateTime` DATETIME DEFAULT NULL,
  `SapEmpNo` VARCHAR(10) DEFAULT NULL,
  `PFTrust` CHAR(1) DEFAULT NULL,
  `ClaimMoreThenMonth` CHAR(1) DEFAULT NULL,
  `ReasonLeaving` VARCHAR(50) DEFAULT NULL,
  `LeaveBalStartMonth` VARCHAR(10) DEFAULT NULL,
  `Metro` ENUM('N','Y') DEFAULT 'N',
  `HOD` ENUM('N','Y') DEFAULT 'N',
  `HOD_Type` VARCHAR(25) DEFAULT '',
  `HOD_Level` TINYINT(6) UNSIGNED DEFAULT 0,
  `LWF` VARCHAR(50) DEFAULT NULL,
  `AadharID` VARCHAR(15) DEFAULT NULL,
  `UAN` VARCHAR(15) DEFAULT NULL,
  `IFSC_Code` VARCHAR(20) DEFAULT NULL,
  `Leve_Reg_GEN` ENUM('Y','N') DEFAULT 'Y',
  `VoterID` VARCHAR(15) DEFAULT NULL,
  `DrivingLicense` VARCHAR(20) DEFAULT NULL,
  `ReqNo` VARCHAR(20) DEFAULT NULL,
  `ReqDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Religion` VARCHAR(50) DEFAULT NULL,
  `Cast_Category` VARCHAR(15) DEFAULT NULL,
  `Education` VARCHAR(100) DEFAULT NULL,
  `Previous_Experience` DECIMAL(5,2) DEFAULT NULL,
  `TypeOfEmployment` VARCHAR(50) DEFAULT NULL,
  `AnyRelativeIn_SAC` ENUM('Y','N') DEFAULT 'N',
  `SAC_EmpInfo` VARCHAR(255) DEFAULT NULL,
  `Web_UserType` SMALLINT(6) DEFAULT -1,
  `Domicile` VARCHAR(255) DEFAULT NULL,
  `Enable` CHAR(1) DEFAULT 'Y',
  `SinglePunchAllow` ENUM('N','Y') DEFAULT 'N',
  `Permanent_Present` ENUM('N','Y') DEFAULT 'N',
  `ExcludeAutoGenMail` ENUM('N','Y') DEFAULT 'N',
  `WorkOrder` VARCHAR(50) DEFAULT NULL,
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDateTime` DATETIME DEFAULT NULL,
  `NPS_Applicable` CHAR(1) DEFAULT 'N',
  `LastPswChange` DATETIME DEFAULT NULL,
  PRIMARY KEY (`EmpNo`),
  UNIQUE KEY `EmpNo` (`EmpNo`) USING BTREE,
  KEY `DepartmentCode` (`DepartmentCode`),
  KEY `DesignationCode` (`DesignationCode`),
  KEY `PunchCard` (`PunchCardNo`) USING BTREE,
  KEY `EmployeeFn` (`FirstName`) USING BTREE,
  KEY `EmployeeLn` (`LastName`) USING BTREE,
  KEY `CategoryCode` (`CategoryCode`) USING BTREE,
  KEY `CompanyCode` (`CompanyCode`) USING BTREE,
  KEY `LocationCode` (`LocationCode`) USING BTREE,
  KEY `Enable` (`Enable`),
  KEY `SecurityRole` (`SecurityRole`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Employee Dates
CREATE TABLE IF NOT EXISTS `employeedates` (
  `EmpNo` VARCHAR(20) NOT NULL,
  `Doj` DATE DEFAULT NULL,
  `DoBirth` DATE DEFAULT NULL,
  `DateOfConfirm` DATE DEFAULT NULL,
  `DateOfRetire` DATE DEFAULT NULL,
  `DateOfRelieve` DATE DEFAULT NULL,
  `TrainingFrom` DATE DEFAULT NULL,
  `TrainingUpto` DATE DEFAULT NULL,
  `ProbationFrom` DATE DEFAULT NULL,
  `ProbationUpto` DATE DEFAULT NULL,
  `WeeklyOffOne` VARCHAR(9) DEFAULT 'Sunday',
  `WeeklyOffTwo` VARCHAR(9) DEFAULT NULL,
  `WeeklyOffTwoHalfOrFull` VARCHAR(1) DEFAULT NULL,
  `WeeklyOffTwoFullDayHrs` DECIMAL(10,0) DEFAULT NULL,
  `WeeklyOffTwoHalfDayHrs` DECIMAL(10,0) DEFAULT NULL,
  `ShiftPatternID` SMALLINT(6) DEFAULT 1,
  `WeeklyOffTwo1` TINYINT(3) UNSIGNED DEFAULT 0,
  `WeeklyOffTwo2` TINYINT(3) UNSIGNED DEFAULT 0,
  `WeeklyOffTwo3` TINYINT(3) UNSIGNED DEFAULT 0,
  `WeeklyOffTwo4` TINYINT(3) UNSIGNED DEFAULT 0,
  `WeeklyOffTwo5` TINYINT(3) UNSIGNED DEFAULT 0,
  `WeeklyOffTwo6` TINYINT(3) UNSIGNED DEFAULT 0,
  `PoliceVerificationDate` DATE DEFAULT NULL,
  `PeriodicMedicalDate` DATE DEFAULT NULL,
  `SafetyTrainingDate` DATE DEFAULT NULL,
  `WeeklyOffTwoMonthFixed` ENUM('Y','N') DEFAULT 'Y',
  `UpdateDateTime` DATETIME DEFAULT NULL,
  PRIMARY KEY (`EmpNo`),
  UNIQUE KEY `EmpNo` (`EmpNo`) USING BTREE,
  CONSTRAINT `fk_employeedates_employee` FOREIGN KEY (`EmpNo`) REFERENCES `employeemaster` (`EmpNo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Employee Personal
CREATE TABLE IF NOT EXISTS `employeepersonal` (
  `EmpNo` VARCHAR(20) NOT NULL,
  `PermanentAddress` VARCHAR(255) DEFAULT NULL,
  `PVillage` VARCHAR(50) DEFAULT NULL,
  `PDistrict` VARCHAR(50) DEFAULT NULL,
  `PCity` VARCHAR(50) DEFAULT NULL,
  `PState` VARCHAR(50) DEFAULT NULL,
  `PPinCode` VARCHAR(10) DEFAULT NULL,
  `CurrentAddress` VARCHAR(255) DEFAULT NULL,
  `CVillage` VARCHAR(50) DEFAULT NULL,
  `CDistrict` VARCHAR(50) DEFAULT NULL,
  `CCity` VARCHAR(50) DEFAULT NULL,
  `CState` VARCHAR(50) DEFAULT NULL,
  `CPinCode` VARCHAR(10) DEFAULT NULL,
  `PhoneNo` VARCHAR(20) DEFAULT NULL,
  `Mobile` VARCHAR(15) DEFAULT NULL,
  `Email` VARCHAR(150) DEFAULT NULL,
  `Remarks` VARCHAR(100) DEFAULT NULL,
  `MaritalStatus` VARCHAR(15) DEFAULT NULL,
  `SpouseName` VARCHAR(50) DEFAULT NULL,
  `NoOfKids` INT(11) DEFAULT NULL,
  `MedicalHistory` VARCHAR(1000) DEFAULT NULL,
  `AllergicTo` VARCHAR(255) DEFAULT NULL,
  `LastMedicalCheckUp` DATE DEFAULT NULL,
  `EmergencyContact` VARCHAR(255) DEFAULT NULL,
  `MedicalPolicy` VARCHAR(100) DEFAULT NULL,
  `AccidentPolicy` VARCHAR(100) DEFAULT NULL,
  `MarkOfIdentification` VARCHAR(100) DEFAULT NULL,
  `VaccineDate1` DATE DEFAULT NULL,
  `VaccineDate2` DATE DEFAULT NULL,
  `Unit` VARCHAR(70) DEFAULT '',
  `SubUnit` VARCHAR(70) DEFAULT '',
  `LanguageKnown` VARCHAR(50) DEFAULT '',
  PRIMARY KEY (`EmpNo`),
  UNIQUE KEY `EmpNo` (`EmpNo`) USING BTREE,
  CONSTRAINT `fk_employeepersonal_employee` FOREIGN KEY (`EmpNo`) REFERENCES `employeemaster` (`EmpNo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------------------------------------------------------
-- 2. Security Master Tables
-- ----------------------------------------------------------------------------

-- Security Post Category Master
CREATE TABLE IF NOT EXISTS `securitypostcategorymaster` (
  `PostCategoryCode` SMALLINT(3) UNSIGNED NOT NULL AUTO_INCREMENT,
  `PostCategoryName` VARCHAR(100) NOT NULL,
  `Description` VARCHAR(255) DEFAULT NULL,
  `Enable` ENUM('Y','N') DEFAULT 'Y',
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDateTime` DATETIME DEFAULT NULL,
  PRIMARY KEY (`PostCategoryCode`),
  UNIQUE KEY `uk_PostCategoryName` (`PostCategoryName`) USING BTREE,
  KEY `Enable` (`Enable`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Security Post Master
CREATE TABLE IF NOT EXISTS `securitypostmaster` (
  `PostCode` SMALLINT(3) UNSIGNED NOT NULL AUTO_INCREMENT,
  `PostName` VARCHAR(100) NOT NULL,
  `PostShortName` VARCHAR(20) DEFAULT NULL,
  `PostCategoryCode` SMALLINT(3) UNSIGNED NOT NULL,
  `LocationCode` SMALLINT(2) UNSIGNED DEFAULT NULL,
  `Priority` SMALLINT(3) UNSIGNED NOT NULL DEFAULT 1,
  `MinimumGuards` TINYINT(3) UNSIGNED NOT NULL DEFAULT 1,
  `MaximumGuards` TINYINT(3) UNSIGNED NOT NULL DEFAULT 1,
  `FemaleOnly` ENUM('Y','N') DEFAULT 'N',
  `CriticalPost` ENUM('Y','N') DEFAULT 'N',
  `RestrictedPost` ENUM('Y','N') DEFAULT 'N',
  `Remarks` VARCHAR(255) DEFAULT NULL,
  `Enable` ENUM('Y','N') DEFAULT 'Y',
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDateTime` DATETIME DEFAULT NULL,
  PRIMARY KEY (`PostCode`),
  UNIQUE KEY `uk_PostName` (`PostName`) USING BTREE,
  KEY `PostCategoryCode` (`PostCategoryCode`),
  KEY `LocationCode` (`LocationCode`),
  KEY `Priority` (`Priority`),
  KEY `CriticalPost` (`CriticalPost`),
  KEY `Enable` (`Enable`),
  CONSTRAINT `fk_securitypostmaster_postcategory`
    FOREIGN KEY (`PostCategoryCode`)
    REFERENCES `securitypostcategorymaster` (`PostCategoryCode`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_securitypostmaster_location`
    FOREIGN KEY (`LocationCode`)
    REFERENCES `locationmaster` (`LocationCode`)
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Security Allocation Rule Master
CREATE TABLE IF NOT EXISTS `securityallocationrulemaster` (
  `RuleCode` SMALLINT(3) UNSIGNED NOT NULL AUTO_INCREMENT,
  `RuleName` VARCHAR(100) NOT NULL,
  `RuleDescription` VARCHAR(255) DEFAULT NULL,
  `RulePriority` SMALLINT(3) UNSIGNED NOT NULL DEFAULT 1,
  `CriticalPostFirst` ENUM('Y','N') DEFAULT 'Y',
  `PriorityBasedAllocation` ENUM('Y','N') DEFAULT 'Y',
  `ReportingTimeBasedAllocation` ENUM('Y','N') DEFAULT 'Y',
  `SkillBasedAllocation` ENUM('Y','N') DEFAULT 'Y',
  `GenderBasedAllocation` ENUM('Y','N') DEFAULT 'Y',
  `RestrictedDutyCheck` ENUM('Y','N') DEFAULT 'Y',
  `RotationApplicable` ENUM('Y','N') DEFAULT 'Y',
  `Enable` ENUM('Y','N') DEFAULT 'Y',
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDateTime` DATETIME DEFAULT NULL,
  PRIMARY KEY (`RuleCode`),
  UNIQUE KEY `uk_RuleName` (`RuleName`) USING BTREE,
  KEY `Enable` (`Enable`),
  KEY `RulePriority` (`RulePriority`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Security Guard Restriction Master
CREATE TABLE IF NOT EXISTS `securityguardrestrictionmaster` (
  `RestrictionCode` SMALLINT(3) UNSIGNED NOT NULL AUTO_INCREMENT,
  `RestrictionName` VARCHAR(100) NOT NULL,
  `Description` VARCHAR(255) DEFAULT NULL,
  `Enable` ENUM('Y','N') DEFAULT 'Y',
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDateTime` DATETIME DEFAULT NULL,
  PRIMARY KEY (`RestrictionCode`),
  UNIQUE KEY `uk_RestrictionName` (`RestrictionName`) USING BTREE,
  KEY `Enable` (`Enable`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Security Device Master
CREATE TABLE IF NOT EXISTS `securitydevicemaster` (
  `DeviceCode` SMALLINT(3) UNSIGNED NOT NULL AUTO_INCREMENT,
  `DeviceName` VARCHAR(100) NOT NULL,
  `DeviceSerialNo` VARCHAR(100) DEFAULT NULL,
  `DeviceModel` VARCHAR(100) DEFAULT NULL,
  `IPAddress` VARCHAR(45) NOT NULL,
  `PortNo` SMALLINT(5) UNSIGNED NOT NULL DEFAULT 4370,
  `CommunicationType` ENUM('TCP/IP','USB','RS232') DEFAULT 'TCP/IP',
  `LocationCode` SMALLINT(2) UNSIGNED DEFAULT NULL,
  `DeviceStatus` ENUM('ONLINE','OFFLINE','MAINTENANCE') DEFAULT 'OFFLINE',
  `LastHeartbeat` DATETIME DEFAULT NULL,
  `LastSyncDateTime` DATETIME DEFAULT NULL,
  `Remarks` VARCHAR(255) DEFAULT NULL,
  `Enable` ENUM('Y','N') DEFAULT 'Y',
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDateTime` DATETIME DEFAULT NULL,
  PRIMARY KEY (`DeviceCode`),
  UNIQUE KEY `uk_DeviceIP` (`IPAddress`) USING BTREE,
  UNIQUE KEY `uk_DeviceSerialNo` (`DeviceSerialNo`) USING BTREE,
  KEY `LocationCode` (`LocationCode`),
  KEY `DeviceStatus` (`DeviceStatus`),
  KEY `Enable` (`Enable`),
  CONSTRAINT `fk_securitydevicemaster_location`
    FOREIGN KEY (`LocationCode`)
    REFERENCES `locationmaster` (`LocationCode`)
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------------------------------------------------------
-- 3. Operational Transaction Tables
-- ----------------------------------------------------------------------------

-- Security Attendance Transactions
CREATE TABLE IF NOT EXISTS `securityattendance` (
  `AttendanceCode` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `EmpNo` VARCHAR(20) NOT NULL,
  `PunchCardNo` INT(11) DEFAULT NULL,
  `DeviceCode` SMALLINT(3) UNSIGNED NOT NULL,
  `PunchDate` DATE NOT NULL,
  `PunchTime` TIME NOT NULL,
  `PunchDateTime` DATETIME NOT NULL,
  `ShiftCode` TINYINT(4) UNSIGNED DEFAULT NULL,
  `PunchType` ENUM('IN','OUT') DEFAULT 'IN',
  `AttendanceStatus` ENUM('PENDING','ALLOCATED','REJECTED','DUPLICATE') DEFAULT 'PENDING',
  `Remarks` VARCHAR(255) DEFAULT NULL,
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDateTime` DATETIME DEFAULT NULL,
  PRIMARY KEY (`AttendanceCode`),
  KEY `EmpNo` (`EmpNo`),
  KEY `PunchDate` (`PunchDate`),
  KEY `PunchDateTime` (`PunchDateTime`),
  KEY `ShiftCode` (`ShiftCode`),
  KEY `AttendanceStatus` (`AttendanceStatus`),
  KEY `DeviceCode` (`DeviceCode`),
  CONSTRAINT `fk_securityattendance_employee`
    FOREIGN KEY (`EmpNo`)
    REFERENCES `employeemaster` (`EmpNo`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_securityattendance_device`
    FOREIGN KEY (`DeviceCode`)
    REFERENCES `securitydevicemaster` (`DeviceCode`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_securityattendance_shift`
    FOREIGN KEY (`ShiftCode`)
    REFERENCES `shiftmaster` (`ShiftCode`)
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Security Deployment
CREATE TABLE IF NOT EXISTS `securitydeployment` (
  `DeploymentCode` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `DeploymentDate` DATE NOT NULL,
  `EmpNo` VARCHAR(20) NOT NULL,
  `PostCode` SMALLINT(3) UNSIGNED NOT NULL,
  `ShiftCode` TINYINT(4) UNSIGNED NOT NULL,
  `ReportingTime` DATETIME DEFAULT NULL,
  `RelievingTime` DATETIME DEFAULT NULL,
  `AllocationMethod` ENUM('AUTO','MANUAL','OVERRIDE') DEFAULT 'AUTO',
  `DeploymentStatus` ENUM('ALLOCATED','REPORTED','COMPLETED','ABSENT','CANCELLED') DEFAULT 'ALLOCATED',
  `AllocatedBy` VARCHAR(20) DEFAULT NULL,
  `ApprovedBy` VARCHAR(20) DEFAULT NULL,
  `Remarks` VARCHAR(255) DEFAULT NULL,
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDateTime` DATETIME DEFAULT NULL,
  PRIMARY KEY (`DeploymentCode`),
  UNIQUE KEY `uk_Deployment` (`DeploymentDate`,`EmpNo`,`ShiftCode`),
  KEY `PostCode` (`PostCode`),
  KEY `ShiftCode` (`ShiftCode`),
  KEY `DeploymentDate` (`DeploymentDate`),
  KEY `DeploymentStatus` (`DeploymentStatus`),
  CONSTRAINT `fk_deployment_employee`
    FOREIGN KEY (`EmpNo`)
    REFERENCES `employeemaster` (`EmpNo`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_deployment_post`
    FOREIGN KEY (`PostCode`)
    REFERENCES `securitypostmaster` (`PostCode`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_deployment_shift`
    FOREIGN KEY (`ShiftCode`)
    REFERENCES `shiftmaster` (`ShiftCode`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_deployment_allocatedby`
    FOREIGN KEY (`AllocatedBy`)
    REFERENCES `employeemaster` (`EmpNo`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_deployment_approvedby`
    FOREIGN KEY (`ApprovedBy`)
    REFERENCES `employeemaster` (`EmpNo`)
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Security Deployment History
CREATE TABLE IF NOT EXISTS `securitydeploymenthistory` (
  `HistoryCode` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `DeploymentCode` BIGINT(20) UNSIGNED NOT NULL,
  `EmpNo` VARCHAR(20) NOT NULL,
  `PostCode` SMALLINT(3) UNSIGNED NOT NULL,
  `ShiftCode` TINYINT(4) UNSIGNED NOT NULL,
  `DeploymentStatus` ENUM('ALLOCATED','REPORTED','COMPLETED','ABSENT','CANCELLED') NOT NULL,
  `ActionType` ENUM('CREATED','UPDATED','OVERRIDDEN','STATUS_CHANGED','DELETED') NOT NULL,
  `ChangedBy` VARCHAR(20) NOT NULL,
  `Remarks` VARCHAR(255) DEFAULT NULL,
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`HistoryCode`),
  KEY `DeploymentCode` (`DeploymentCode`),
  KEY `EmpNo` (`EmpNo`),
  KEY `PostCode` (`PostCode`),
  KEY `ChangedBy` (`ChangedBy`),
  CONSTRAINT `fk_history_deployment`
    FOREIGN KEY (`DeploymentCode`)
    REFERENCES `securitydeployment` (`DeploymentCode`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_history_employee`
    FOREIGN KEY (`EmpNo`)
    REFERENCES `employeemaster` (`EmpNo`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_history_post`
    FOREIGN KEY (`PostCode`)
    REFERENCES `securitypostmaster` (`PostCode`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_history_shift`
    FOREIGN KEY (`ShiftCode`)
    REFERENCES `shiftmaster` (`ShiftCode`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_history_changedby`
    FOREIGN KEY (`ChangedBy`)
    REFERENCES `employeemaster` (`EmpNo`)
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Security Alert Log
CREATE TABLE IF NOT EXISTS `securityalertlog` (
  `AlertCode` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `AlertDateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `AlertType` ENUM('VACANT_POST','ABSENT_GUARD','LATE_REPORTING','DEVICE_OFFLINE','AUTO_ALLOCATION_FAILED','OVERTIME','UNAUTHORIZED_PUNCH') NOT NULL,
  `Severity` ENUM('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
  `DeploymentCode` BIGINT(20) UNSIGNED DEFAULT NULL,
  `EmpNo` VARCHAR(20) DEFAULT NULL,
  `PostCode` SMALLINT(3) UNSIGNED DEFAULT NULL,
  `DeviceCode` SMALLINT(3) UNSIGNED DEFAULT NULL,
  `AlertMessage` VARCHAR(500) NOT NULL,
  `Resolved` ENUM('Y','N') DEFAULT 'N',
  `ResolvedBy` VARCHAR(20) DEFAULT NULL,
  `ResolvedDateTime` DATETIME DEFAULT NULL,
  `Remarks` VARCHAR(255) DEFAULT NULL,
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`AlertCode`),
  KEY `AlertType` (`AlertType`),
  KEY `Severity` (`Severity`),
  KEY `Resolved` (`Resolved`),
  KEY `EmpNo` (`EmpNo`),
  KEY `PostCode` (`PostCode`),
  KEY `DeploymentCode` (`DeploymentCode`),
  KEY `DeviceCode` (`DeviceCode`),
  CONSTRAINT `fk_alert_deployment`
    FOREIGN KEY (`DeploymentCode`)
    REFERENCES `securitydeployment` (`DeploymentCode`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_alert_employee`
    FOREIGN KEY (`EmpNo`)
    REFERENCES `employeemaster` (`EmpNo`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_alert_post`
    FOREIGN KEY (`PostCode`)
    REFERENCES `securitypostmaster` (`PostCode`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_alert_device`
    FOREIGN KEY (`DeviceCode`)
    REFERENCES `securitydevicemaster` (`DeviceCode`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_alert_resolvedby`
    FOREIGN KEY (`ResolvedBy`)
    REFERENCES `employeemaster` (`EmpNo`)
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Security Post Vacancy
CREATE TABLE IF NOT EXISTS `securitypostvacancy` (
  `VacancyCode` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `VacancyDate` DATE NOT NULL,
  `PostCode` SMALLINT(3) UNSIGNED NOT NULL,
  `ShiftCode` TINYINT(4) UNSIGNED NOT NULL,
  `RequiredGuards` SMALLINT(3) UNSIGNED NOT NULL DEFAULT 0,
  `AllocatedGuards` SMALLINT(3) UNSIGNED NOT NULL DEFAULT 0,
  `PresentGuards` SMALLINT(3) UNSIGNED NOT NULL DEFAULT 0,
  `VacantGuards` SMALLINT(3) UNSIGNED NOT NULL DEFAULT 0,
  `Status` ENUM('VACANT','PARTIALLY_ALLOCATED','FULLY_ALLOCATED') DEFAULT 'VACANT',
  `LastUpdated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`VacancyCode`),
  UNIQUE KEY `uk_PostShiftDate` (`VacancyDate`, `PostCode`, `ShiftCode`),
  KEY `PostCode` (`PostCode`),
  KEY `ShiftCode` (`ShiftCode`),
  KEY `Status` (`Status`),
  CONSTRAINT `fk_vacancy_post`
    FOREIGN KEY (`PostCode`)
    REFERENCES `securitypostmaster` (`PostCode`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_vacancy_shift`
    FOREIGN KEY (`ShiftCode`)
    REFERENCES `shiftmaster` (`ShiftCode`)
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
