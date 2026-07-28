const authRepository = require('../repositories/AuthRepository');
const { comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { MESSAGES } = require('../constants/messages');
const { logger } = require('../config/logger');
const sessionStore = require('../utils/SessionStore');
const { getIO } = require('../websocket/socketServer');

class AuthService {
  async login(empNo, password, ipAddress = '127.0.0.1', userAgent = 'Browser') {
    const cleanEmpNo = String(empNo).trim();
    const user = await authRepository.findByEmpNo(cleanEmpNo);

    if (!user) {
      logger.warn(`Login attempt failed: Employee #${cleanEmpNo} not found in database.`);
      throw new Error(MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.Enable && user.Enable.toUpperCase() === 'N') {
      logger.warn(`Login attempt failed: Employee #${cleanEmpNo} is disabled.`);
      throw new Error(MESSAGES.INVALID_CREDENTIALS);
    }

    const isMatch = await comparePassword(password, user.Password);
    if (!isMatch) {
      logger.warn(`Login attempt failed: Password mismatch for Employee #${cleanEmpNo}.`);
      throw new Error(MESSAGES.INVALID_CREDENTIALS);
    }

    const userResponse = {
      empNo: user.EmpNo,
      firstName: user.FirstName,
      lastName: user.LastName,
      gender: user.Gender,
      role: user.SecurityRole,
      department: user.department ? user.department.DepartmentName : null,
      designation: user.designation ? user.designation.Designation : null,
      location: user.location ? user.location.Location : null,
    };

    // Check for Active Session on another device
    const activeSession = sessionStore.getActiveSession(cleanEmpNo);
    if (activeSession) {
      logger.warn(`Concurrent login attempt detected for Employee #${cleanEmpNo} from IP ${ipAddress}. Active session exists from ${activeSession.ipAddress}.`);
      return {
        isConcurrent: true,
        activeSession: {
          ipAddress: activeSession.ipAddress,
          loginTime: activeSession.loginTime,
        },
        user: userResponse,
      };
    }

    // Register New Session
    const sessionId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const token = generateToken({
      empNo: user.EmpNo,
      role: user.SecurityRole,
      firstName: user.FirstName,
      lastName: user.LastName,
      sessionId,
    });

    sessionStore.createSession(user.EmpNo, token, sessionId, ipAddress, userAgent);

    return { token, user: userResponse, isConcurrent: false };
  }

  async forceLogin(empNo, password, ipAddress = '127.0.0.1', userAgent = 'Browser') {
    const cleanEmpNo = String(empNo).trim();
    const user = await authRepository.findByEmpNo(cleanEmpNo);

    if (!user || (user.Enable && user.Enable.toUpperCase() === 'N')) {
      throw new Error(MESSAGES.INVALID_CREDENTIALS);
    }

    const isMatch = await comparePassword(password, user.Password);
    if (!isMatch) {
      throw new Error(MESSAGES.INVALID_CREDENTIALS);
    }

    // 1. Revoke existing active session
    sessionStore.removeSession(cleanEmpNo);

    // 2. Broadcast Socket.IO SessionTerminated event to log out former session
    try {
      const io = getIO();
      io.emit(`SessionTerminated_${cleanEmpNo}`, {
        empNo: cleanEmpNo,
        message: 'Your active session was terminated because a login occurred on another device.',
      });
    } catch (err) {
      // Socket silent fallback
    }

    // 3. Create New Session
    const sessionId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const token = generateToken({
      empNo: user.EmpNo,
      role: user.SecurityRole,
      firstName: user.FirstName,
      lastName: user.LastName,
      sessionId,
    });

    sessionStore.createSession(user.EmpNo, token, sessionId, ipAddress, userAgent);

    const userResponse = {
      empNo: user.EmpNo,
      firstName: user.FirstName,
      lastName: user.LastName,
      gender: user.Gender,
      role: user.SecurityRole,
      department: user.department ? user.department.DepartmentName : null,
      designation: user.designation ? user.designation.Designation : null,
      location: user.location ? user.location.Location : null,
    };

    logger.info(`Force login successful: Session terminated on old device for Employee #${cleanEmpNo}. New session registered.`);

    return { token, user: userResponse };
  }

  async logout(empNo) {
    sessionStore.removeSession(empNo);
    return { success: true };
  }

  async getProfile(empNo) {
    const user = await authRepository.findByEmpNo(empNo);
    if (!user) throw new Error(MESSAGES.EMPLOYEE_NOT_FOUND);

    return {
      empNo: user.EmpNo,
      firstName: user.FirstName,
      lastName: user.LastName,
      gender: user.Gender,
      role: user.SecurityRole,
      department: user.department ? user.department.DepartmentName : null,
      designation: user.designation ? user.designation.Designation : null,
      location: user.location ? user.location.Location : null,
    };
  }
}

module.exports = new AuthService();
