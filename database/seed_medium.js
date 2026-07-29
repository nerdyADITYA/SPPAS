const { prisma } = require('../backend/src/config/prisma');

async function seedMediumDataset() {
  console.log('=======================================================');
  console.log('Starting SPPAS Medium-Scale Simulation Seeding Process');
  console.log('=======================================================');

  // Hashed password for Admin@123
  const defaultPasswordHash = '$2a$10$W.EX5Tlj7cl6UceS1M75iuwsBRS8b2HZEsQBMDyZY4sncryoNt2I2';
  const passwordBuffer = Buffer.from(defaultPasswordHash);

  // 1. Seed Companies (3 Companies)
  console.log('Seeding Companies...');
  const companies = [
    { CompanyCode: 1, CompanyName: 'Main Plant Facility', CompanyEnable: 'Y', CompanyType: 'PRINCIPAL' },
    { CompanyCode: 2, CompanyName: 'Corporate Headquarters', CompanyEnable: 'Y', CompanyType: 'CORPORATE' },
    { CompanyCode: 3, CompanyName: 'Logistics & Cargo Hub', CompanyEnable: 'Y', CompanyType: 'LOGISTICS' },
  ];
  for (const comp of companies) {
    await prisma.company.upsert({
      where: { CompanyCode: comp.CompanyCode },
      update: comp,
      create: comp,
    });
  }

  // 2. Seed Departments (4 Departments)
  console.log('Seeding Departments...');
  const departments = [
    { DepartmentCode: 1, DepartmentName: 'Security & Loss Prevention', ShortDeptName: 'SEC', Enable: 'Y' },
    { DepartmentCode: 2, DepartmentName: 'IT & Data Security', ShortDeptName: 'ITS', Enable: 'Y' },
    { DepartmentCode: 3, DepartmentName: 'Facilities & Logistics', ShortDeptName: 'LOG', Enable: 'Y' },
    { DepartmentCode: 4, DepartmentName: 'Executive Protection', ShortDeptName: 'EXP', Enable: 'Y' },
  ];
  for (const dept of departments) {
    await prisma.departmentmaster.upsert({
      where: { DepartmentCode: dept.DepartmentCode },
      update: dept,
      create: dept,
    });
  }

  // 3. Seed Designations (4 Designations)
  console.log('Seeding Designations...');
  const designations = [
    { DesignationCode: 1, Designation: 'Security Officer', Enable: 'Y' },
    { DesignationCode: 2, Designation: 'Security Supervisor', Enable: 'Y' },
    { DesignationCode: 3, Designation: 'Security Guard', Enable: 'Y' },
    { DesignationCode: 4, Designation: 'Lady Security Guard', Enable: 'Y' },
  ];
  for (const desig of designations) {
    await prisma.designationmaster.upsert({
      where: { DesignationCode: desig.DesignationCode },
      update: desig,
      create: desig,
    });
  }

  // 4. Seed Locations (5 Locations)
  console.log('Seeding Locations...');
  const locations = [
    { LocationCode: 1, Location: 'North Gate Sector', ShortLocName: 'NGS', Enable: 'Y' },
    { LocationCode: 2, Location: 'South Cargo Gate', ShortLocName: 'SCG', Enable: 'Y' },
    { LocationCode: 3, Location: 'Data Center Alpha', ShortLocName: 'DCA', Enable: 'Y' },
    { LocationCode: 4, Location: 'Admin Tower Lobby', ShortLocName: 'ATL', Enable: 'Y' },
    { LocationCode: 5, Location: 'Perimeter Zone B', ShortLocName: 'PZB', Enable: 'Y' },
  ];
  for (const loc of locations) {
    await prisma.locationmaster.upsert({
      where: { LocationCode: loc.LocationCode },
      update: loc,
      create: loc,
    });
  }

  // 5. Seed Shifts (3 Shifts)
  console.log('Seeding Shifts...');
  const shifts = [
    { ShiftCode: 1, Shift: 'Morning Shift (A)', Enable: 'Y' },
    { ShiftCode: 2, Shift: 'Afternoon Shift (B)', Enable: 'Y' },
    { ShiftCode: 3, Shift: 'Night Shift (C)', Enable: 'Y' },
  ];
  for (const shift of shifts) {
    await prisma.shiftmaster.upsert({
      where: { ShiftCode: shift.ShiftCode },
      update: shift,
      create: shift,
    });
  }

  // 6. Seed Post Categories (5 Categories)
  console.log('Seeding Security Post Categories...');
  const categories = [
    { PostCategoryCode: 1, PostCategoryName: 'Main Entrance Gates', Description: 'Primary vehicular and pedestrian access points' },
    { PostCategoryCode: 2, PostCategoryName: 'Critical Infrastructure', Description: 'Restricted zones requiring high security authorization' },
    { PostCategoryCode: 3, PostCategoryName: 'Office & Executive Receptions', Description: 'Front desk administrative security' },
    { PostCategoryCode: 4, PostCategoryName: 'Perimeter Patrol Units', Description: 'Mobile and fixed perimeter security posts' },
    { PostCategoryCode: 5, PostCategoryName: 'Cargo & Material Gates', Description: 'Shipping, receiving, and truck inspection gates' },
  ];
  for (const cat of categories) {
    await prisma.securitypostcategorymaster.upsert({
      where: { PostCategoryCode: cat.PostCategoryCode },
      update: cat,
      create: cat,
    });
  }

  // 7. Seed 15 Security Duty Posts
  console.log('Seeding 15 Security Duty Posts...');
  const postsData = [
    { PostCode: 1, PostName: 'North Gate Main Entrance', PostShortName: 'NG-1', PostCategoryCode: 1, LocationCode: 1, Priority: 1, MinimumGuards: 3, MaximumGuards: 5, FemaleOnly: 'N', CriticalPost: 'Y' },
    { PostCode: 2, PostName: 'North Gate Visitor Turnstile', PostShortName: 'NG-VT', PostCategoryCode: 1, LocationCode: 1, Priority: 2, MinimumGuards: 2, MaximumGuards: 3, FemaleOnly: 'N', CriticalPost: 'Y' },
    { PostCode: 3, PostName: 'North Gate Female Frisking Bay', PostShortName: 'NG-FF', PostCategoryCode: 1, LocationCode: 1, Priority: 2, MinimumGuards: 2, MaximumGuards: 3, FemaleOnly: 'Y', CriticalPost: 'Y' },
    { PostCode: 4, PostName: 'South Cargo Truck Gate', PostShortName: 'SC-TG', PostCategoryCode: 5, LocationCode: 2, Priority: 1, MinimumGuards: 2, MaximumGuards: 4, FemaleOnly: 'N', CriticalPost: 'Y' },
    { PostCode: 5, PostName: 'South Weighbridge Control', PostShortName: 'SC-WB', PostCategoryCode: 5, LocationCode: 2, Priority: 3, MinimumGuards: 1, MaximumGuards: 2, FemaleOnly: 'N', CriticalPost: 'N' },
    { PostCode: 6, PostName: 'Data Center Main Biometric Vault', PostShortName: 'DC-BV', PostCategoryCode: 2, LocationCode: 3, Priority: 1, MinimumGuards: 2, MaximumGuards: 3, FemaleOnly: 'N', CriticalPost: 'Y' },
    { PostCode: 7, PostName: 'Data Center Server Room A', PostShortName: 'DC-SR', PostCategoryCode: 2, LocationCode: 3, Priority: 2, MinimumGuards: 1, MaximumGuards: 2, FemaleOnly: 'N', CriticalPost: 'Y' },
    { PostCode: 8, PostName: 'Admin Tower Ground Reception', PostShortName: 'AT-GR', PostCategoryCode: 3, LocationCode: 4, Priority: 3, MinimumGuards: 2, MaximumGuards: 3, FemaleOnly: 'N', CriticalPost: 'N' },
    { PostCode: 9, PostName: 'Executive Suite Floor 5 Security', PostShortName: 'AT-E5', PostCategoryCode: 3, LocationCode: 4, Priority: 2, MinimumGuards: 1, MaximumGuards: 2, FemaleOnly: 'N', CriticalPost: 'Y' },
    { PostCode: 10, PostName: 'Admin Tower VIP Female Desk', PostShortName: 'AT-VF', PostCategoryCode: 3, LocationCode: 4, Priority: 3, MinimumGuards: 1, MaximumGuards: 2, FemaleOnly: 'Y', CriticalPost: 'N' },
    { PostCode: 11, PostName: 'North Perimeter Watchtower 1', PostShortName: 'PZ-WT1', PostCategoryCode: 4, LocationCode: 5, Priority: 2, MinimumGuards: 1, MaximumGuards: 2, FemaleOnly: 'N', CriticalPost: 'Y' },
    { PostCode: 12, PostName: 'South Perimeter Mobile Patrol', PostShortName: 'PZ-MP2', PostCategoryCode: 4, LocationCode: 5, Priority: 3, MinimumGuards: 2, MaximumGuards: 3, FemaleOnly: 'N', CriticalPost: 'N' },
    { PostCode: 13, PostName: 'Chemical Storage Facility Gate', PostShortName: 'CS-FG', PostCategoryCode: 2, LocationCode: 1, Priority: 1, MinimumGuards: 2, MaximumGuards: 3, FemaleOnly: 'N', CriticalPost: 'Y' },
    { PostCode: 14, PostName: 'Substation & Power Plant Entry', PostShortName: 'PP-SE', PostCategoryCode: 2, LocationCode: 5, Priority: 1, MinimumGuards: 1, MaximumGuards: 2, FemaleOnly: 'N', CriticalPost: 'Y' },
    { PostCode: 15, PostName: 'Staff Cafeteria Entry Checkpoint', PostShortName: 'SC-CP', PostCategoryCode: 3, LocationCode: 4, Priority: 4, MinimumGuards: 1, MaximumGuards: 2, FemaleOnly: 'N', CriticalPost: 'N' },
  ];
  for (const post of postsData) {
    await prisma.securitypostmaster.upsert({
      where: { PostCode: post.PostCode },
      update: post,
      create: post,
    });
  }

  // 8. Seed 8 Biometric Devices
  console.log('Seeding 8 Biometric Devices...');
  const devicesData = [
    { DeviceCode: 1, DeviceName: 'North Gate Main Reader A', DeviceSerialNo: 'ZK-NG-001', DeviceModel: 'ZKTeco F22', IPAddress: '192.168.1.101', PortNo: 4370, LocationCode: 1, DeviceStatus: 'ONLINE' },
    { DeviceCode: 2, DeviceName: 'North Gate Turnstile Reader B', DeviceSerialNo: 'ZK-NG-002', DeviceModel: 'ZKTeco F22', IPAddress: '192.168.1.102', PortNo: 4370, LocationCode: 1, DeviceStatus: 'ONLINE' },
    { DeviceCode: 3, DeviceName: 'South Cargo Gate Reader 1', DeviceSerialNo: 'ZK-SC-003', DeviceModel: 'ZKTeco SpeedFace', IPAddress: '192.168.1.103', PortNo: 4370, LocationCode: 2, DeviceStatus: 'ONLINE' },
    { DeviceCode: 4, DeviceName: 'South Weighbridge Reader 2', DeviceSerialNo: 'ZK-SC-004', DeviceModel: 'ZKTeco SpeedFace', IPAddress: '192.168.1.104', PortNo: 4370, LocationCode: 2, DeviceStatus: 'ONLINE' },
    { DeviceCode: 5, DeviceName: 'Data Center Access Terminal', DeviceSerialNo: 'ZK-DC-005', DeviceModel: 'ZKTeco SilkFP', IPAddress: '192.168.1.105', PortNo: 4370, LocationCode: 3, DeviceStatus: 'ONLINE' },
    { DeviceCode: 6, DeviceName: 'Admin Lobby Main Terminal', DeviceSerialNo: 'ZK-AT-006', DeviceModel: 'ZKTeco SilkFP', IPAddress: '192.168.1.106', PortNo: 4370, LocationCode: 4, DeviceStatus: 'ONLINE' },
    { DeviceCode: 7, DeviceName: 'Perimeter Patrol Station 1', DeviceSerialNo: 'ZK-PZ-007', DeviceModel: 'ZKTeco F18', IPAddress: '192.168.1.107', PortNo: 4370, LocationCode: 5, DeviceStatus: 'ONLINE' },
    { DeviceCode: 8, DeviceName: 'Perimeter Patrol Station 2', DeviceSerialNo: 'ZK-PZ-008', DeviceModel: 'ZKTeco F18', IPAddress: '192.168.1.108', PortNo: 4370, LocationCode: 5, DeviceStatus: 'OFFLINE' },
  ];
  for (const dev of devicesData) {
    await prisma.securitydevicemaster.upsert({
      where: { DeviceCode: dev.DeviceCode },
      update: dev,
      create: dev,
    });
  }

  // 9. Seed 50 Employees across roles
  console.log('Seeding 50 Employees across roles...');
  const firstNamesM = ['Alexander', 'Benjamin', 'Christopher', 'Daniel', 'Ethan', 'Gabriel', 'Henry', 'Isaac', 'Jacob', 'Liam', 'Matthew', 'Nathan', 'Oliver', 'Patrick', 'Quentin', 'Richard', 'Samuel', 'Thomas', 'Victor', 'William', 'Xavier', 'Zachary', 'Aaron', 'Brandon', 'Charles', 'David', 'Edward', 'Frank'];
  const firstNamesF = ['Abigail', 'Charlotte', 'Diana', 'Emma', 'Fiona', 'Grace', 'Hannah', 'Isabella', 'Jessica', 'Katherine'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];

  const employeesList = [
    { empNo: '1001', first: 'System', last: 'SuperAdmin', role: 'SUPERADMIN', gender: 'M', desig: 1, dept: 1, punch: 1001 },
    { empNo: '1002', first: 'Security', last: 'Manager', role: 'ADMIN', gender: 'M', desig: 1, dept: 1, punch: 1002 },
    { empNo: '1003', first: 'Duty', last: 'Supervisor', role: 'SUPERVISOR', gender: 'M', desig: 2, dept: 1, punch: 1003 },
    { empNo: '1004', first: 'ControlRoom', last: 'Operator', role: 'CONTROLROOM', gender: 'M', desig: 2, dept: 1, punch: 1004 },
    { empNo: '1009', first: 'Robert', last: 'Vance', role: 'USER', gender: 'M', desig: 1, dept: 1, punch: 1009 },
    { empNo: '1010', first: 'Marcus', last: 'Aurelius', role: 'USER', gender: 'M', desig: 2, dept: 1, punch: 1010 },
    { empNo: '1011', first: 'David', last: 'Miller', role: 'USER', gender: 'M', desig: 2, dept: 1, punch: 1011 },
    { empNo: '1012', first: 'James', last: 'Wilson', role: 'USER', gender: 'M', desig: 2, dept: 1, punch: 1012 },
    { empNo: '1013', first: 'Sarah', last: 'Connor', role: 'USER', gender: 'F', desig: 2, dept: 1, punch: 1013 },
    { empNo: '1014', first: 'Michael', last: 'Knight', role: 'USER', gender: 'M', desig: 2, dept: 1, punch: 1014 },
    { empNo: '1015', first: 'Ellen', last: 'Ripley', role: 'USER', gender: 'F', desig: 2, dept: 1, punch: 1015 },
    { empNo: '1016', first: 'Arthur', last: 'Pendelton', role: 'USER', gender: 'M', desig: 2, dept: 1, punch: 1016 },
  ];

  // Guards 1005..1008 and 1017..1050 (38 Guards: 28 Male, 10 Female)
  let mIdx = 0;
  let fIdx = 0;
  let lIdx = 0;

  for (let i = 1005; i <= 1050; i++) {
    const empNoStr = String(i);
    if (employeesList.some((e) => e.empNo === empNoStr)) continue;

    const isFemale = (i % 4 === 0);
    const firstName = isFemale ? firstNamesF[fIdx++ % firstNamesF.length] : firstNamesM[mIdx++ % firstNamesM.length];
    const lastName = lastNames[lIdx++ % lastNames.length];
    const gender = isFemale ? 'F' : 'M';
    const desig = isFemale ? 4 : 3;

    employeesList.push({
      empNo: empNoStr,
      first: firstName,
      last: lastName,
      role: 'USER',
      gender: gender,
      desig: desig,
      dept: 1,
      punch: i,
    });
  }

  for (const emp of employeesList) {
    const empData = {
      EmpNo: emp.empNo,
      PunchCardNo: emp.punch,
      FirstName: emp.first,
      LastName: emp.last,
      CompanyCode: 1,
      DepartmentCode: emp.dept,
      DesignationCode: emp.desig,
      CategoryCode: 1,
      LocationCode: Math.floor(Math.random() * 5) + 1,
      Gender: emp.gender,
      Password: passwordBuffer,
      SecurityRole: emp.role,
      Enable: 'Y',
    };

    await prisma.employeemaster.upsert({
      where: { EmpNo: emp.empNo },
      update: empData,
      create: empData,
    });

    await prisma.employeedates.upsert({
      where: { EmpNo: emp.empNo },
      update: { Doj: new Date('2024-01-15') },
      create: { EmpNo: emp.empNo, Doj: new Date('2024-01-15') },
    });

    await prisma.employeepersonal.upsert({
      where: { EmpNo: emp.empNo },
      update: { Mobile: `987654${emp.punch}` },
      create: { EmpNo: emp.empNo, Mobile: `987654${emp.punch}` },
    });
  }

  // 10. Seed Biometric Attendance Punches (38 Guards punched IN for Shift 1 today)
  console.log('Seeding Biometric Attendance Punches for today...');
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const todayDate = new Date(dateStr);

  // Clear existing attendance for today to ensure clean simulation
  await prisma.securityattendance.deleteMany({
    where: { PunchDate: todayDate },
  });

  const guards = employeesList.filter((e) => e.role === 'USER');
  let deviceIdx = 1;

  for (let idx = 0; idx < guards.length; idx++) {
    const guard = guards[idx];
    const totalMinutes = 5 * 60 + 45 + (idx % 30);
    const hh = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const mm = String(totalMinutes % 60).padStart(2, '0');
    const punchTimeStr = `${hh}:${mm}:00`;

    const punchDateTime = new Date(`${dateStr}T${punchTimeStr}`);
    const punchTime = new Date(`1970-01-01T${punchTimeStr}Z`);

    await prisma.securityattendance.create({
      data: {
        EmpNo: guard.empNo,
        PunchCardNo: guard.punch,
        DeviceCode: (deviceIdx++ % 6) + 1,
        PunchDate: todayDate,
        PunchTime: punchTime,
        PunchDateTime: punchDateTime,
        ShiftCode: 1,
        PunchType: 'IN',
        AttendanceStatus: 'PENDING',
        Remarks: `Biometric Punch Reader #${(deviceIdx % 6) + 1}`,
      },
    });
  }

  console.log('=======================================================');
  console.log(`Medium-Scale Simulation Dataset Seeded Successfully!`);
  console.log(`- Companies: 3`);
  console.log(`- Departments: 4`);
  console.log(`- Locations: 5`);
  console.log(`- Security Duty Posts: 15`);
  console.log(`- Biometric Devices: 8`);
  console.log(`- Total Employees: ${employeesList.length}`);
  console.log(`- Pending Biometric Punches Today: ${guards.length}`);
  console.log('=======================================================');
}

seedMediumDataset()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
