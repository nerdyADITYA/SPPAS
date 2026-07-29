const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const FILE_PATH = path.join(DATA_DIR, 'access_rights.json');

const DEFAULT_PERMISSIONS = {
  ADMIN: {
    dashboard: { enabled: true, accessLevel: 'FULL_ACCESS' },
    attendance: { enabled: true, accessLevel: 'FULL_ACCESS' },
    deployment: { enabled: true, accessLevel: 'FULL_ACCESS' },
    posts: { enabled: true, accessLevel: 'FULL_ACCESS' },
    devices: { enabled: true, accessLevel: 'FULL_ACCESS' },
    alerts: { enabled: true, accessLevel: 'FULL_ACCESS' },
    reports: { enabled: true, accessLevel: 'FULL_ACCESS' },
    shifts: { enabled: true, accessLevel: 'FULL_ACCESS' },
    employees: { enabled: true, accessLevel: 'FULL_ACCESS' },
  },
  SUPERVISOR: {
    dashboard: { enabled: true, accessLevel: 'FULL_ACCESS' },
    attendance: { enabled: true, accessLevel: 'FULL_ACCESS' },
    deployment: { enabled: true, accessLevel: 'FULL_ACCESS' },
    posts: { enabled: true, accessLevel: 'FULL_ACCESS' },
    devices: { enabled: true, accessLevel: 'FULL_ACCESS' },
    alerts: { enabled: true, accessLevel: 'FULL_ACCESS' },
    reports: { enabled: true, accessLevel: 'FULL_ACCESS' },
    shifts: { enabled: true, accessLevel: 'VIEW_ONLY' },
    employees: { enabled: false, accessLevel: 'VIEW_ONLY' },
  },
  CONTROLROOM: {
    dashboard: { enabled: true, accessLevel: 'FULL_ACCESS' },
    attendance: { enabled: true, accessLevel: 'FULL_ACCESS' },
    deployment: { enabled: true, accessLevel: 'FULL_ACCESS' },
    posts: { enabled: true, accessLevel: 'VIEW_ONLY' },
    devices: { enabled: true, accessLevel: 'VIEW_ONLY' },
    alerts: { enabled: true, accessLevel: 'FULL_ACCESS' },
    reports: { enabled: true, accessLevel: 'FULL_ACCESS' },
    shifts: { enabled: true, accessLevel: 'VIEW_ONLY' },
    employees: { enabled: false, accessLevel: 'VIEW_ONLY' },
  },
  USER: {
    dashboard: { enabled: true, accessLevel: 'VIEW_ONLY' },
    attendance: { enabled: true, accessLevel: 'VIEW_ONLY' },
    deployment: { enabled: true, accessLevel: 'VIEW_ONLY' },
    posts: { enabled: false, accessLevel: 'VIEW_ONLY' },
    devices: { enabled: false, accessLevel: 'VIEW_ONLY' },
    alerts: { enabled: false, accessLevel: 'VIEW_ONLY' },
    reports: { enabled: false, accessLevel: 'VIEW_ONLY' },
    shifts: { enabled: true, accessLevel: 'VIEW_ONLY' },
    employees: { enabled: false, accessLevel: 'VIEW_ONLY' },
  },
};

class AccessRightsRepository {
  constructor() {
    this.permissions = null;
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(FILE_PATH)) {
        const fileContent = fs.readFileSync(FILE_PATH, 'utf8');
        this.permissions = JSON.parse(fileContent);
      } else {
        this.permissions = DEFAULT_PERMISSIONS;
        this.saveToFile();
      }
    } catch (err) {
      console.error('Error initializing AccessRightsRepository:', err.message);
      this.permissions = DEFAULT_PERMISSIONS;
    }
  }

  saveToFile() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(FILE_PATH, JSON.stringify(this.permissions, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving access rights file:', err.message);
    }
  }

  getPermissions() {
    if (!this.permissions) {
      this.init();
    }
    return this.permissions;
  }

  getPermissionsForRole(role) {
    const all = this.getPermissions();
    if (role === 'SUPERADMIN') {
      // SUPERADMIN has FULL_ACCESS to everything
      const superAdminPerms = {};
      const modules = ['dashboard', 'attendance', 'deployment', 'posts', 'devices', 'alerts', 'reports', 'shifts', 'employees'];
      modules.forEach((mod) => {
        superAdminPerms[mod] = { enabled: true, accessLevel: 'FULL_ACCESS' };
      });
      return superAdminPerms;
    }
    return all[role] || {};
  }

  updatePermissions(newPermissions) {
    this.permissions = {
      ...this.getPermissions(),
      ...newPermissions,
    };
    this.saveToFile();
    return this.permissions;
  }
}

module.exports = new AccessRightsRepository();
