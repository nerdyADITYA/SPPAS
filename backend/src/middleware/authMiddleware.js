const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/apiResponse');
const { MESSAGES } = require('../constants/messages');
const { prisma } = require('../config/prisma');
const sessionStore = require('../utils/SessionStore');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, MESSAGES.UNAUTHORIZED, [], 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return sendError(res, MESSAGES.UNAUTHORIZED, [], 401);
  }

  // Validate active session token
  if (decoded.sessionId) {
    if (sessionStore.hasSession(decoded.empNo)) {
      if (!sessionStore.isSessionValid(decoded.empNo, decoded.sessionId)) {
        return sendError(res, 'Session terminated. You were logged out because a login occurred on another device.', [], 401);
      }
    } else {
      // Server restarted or memory session lost, but JWT is valid -> restore session
      sessionStore.createSession(decoded.empNo, token, decoded.sessionId);
    }
  }

  try {
    const user = await prisma.employeemaster.findUnique({
      where: { EmpNo: decoded.empNo },
      select: {
        EmpNo: true,
        FirstName: true,
        LastName: true,
        SecurityRole: true,
        Enable: true,
      },
    });

    if (!user || user.Enable === 'N') {
      return sendError(res, MESSAGES.UNAUTHORIZED, [], 401);
    }

    sessionStore.updateActivity(decoded.empNo);
    req.user = user;
    next();
  } catch (error) {
    return sendError(res, MESSAGES.INTERNAL_SERVER_ERROR, [error.message], 500);
  }
}

function authorize(roles = []) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, MESSAGES.UNAUTHORIZED, [], 401);
    }

    if (allowedRoles.length && !allowedRoles.includes(req.user.SecurityRole)) {
      return sendError(res, MESSAGES.FORBIDDEN, [], 403);
    }

    next();
  };
}

function checkModuleAccess(moduleKey, actionType = 'READ') {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, MESSAGES.UNAUTHORIZED, [], 401);
    }

    const role = req.user.SecurityRole;
    if (role === 'SUPERADMIN') {
      return next();
    }

    const accessRightsRepository = require('../repositories/AccessRightsRepository');
    const rolePerms = accessRightsRepository.getPermissionsForRole(role);
    const modPerm = rolePerms[moduleKey];

    if (!modPerm || modPerm.enabled === false) {
      return sendError(res, `Access to '${moduleKey}' module has been disabled by SuperAdmin.`, [], 403);
    }

    if (actionType === 'MUTATE' && modPerm.accessLevel === 'VIEW_ONLY') {
      return sendError(res, `Action restricted: You have View Only access to '${moduleKey}'.`, [], 403);
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorize,
  checkModuleAccess,
};
