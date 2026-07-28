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
  if (decoded.sessionId && !sessionStore.isSessionValid(decoded.empNo, decoded.sessionId)) {
    return sendError(res, 'Session terminated. You were logged out because a login occurred on another device.', [], 401);
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

module.exports = {
  authenticate,
  authorize,
};
