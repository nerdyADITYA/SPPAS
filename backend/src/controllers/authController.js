const authService = require('../services/AuthService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

class AuthController {
  async login(req, res, next) {
    try {
      const { empNo, password } = req.body;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || 'Browser';
      const result = await authService.login(empNo, password, ipAddress, userAgent);

      if (result.isConcurrent) {
        return res.status(200).json({
          success: false,
          code: 'CONCURRENT_LOGIN_DETECTED',
          message: `Employee #${result.user.empNo} (${result.user.firstName} ${result.user.lastName}) is currently logged in on another device.`,
          data: result,
        });
      }

      return sendSuccess(res, 'Login successful', result);
    } catch (error) {
      return sendError(res, error.message, [], 401);
    }
  }

  async forceLogin(req, res, next) {
    try {
      const { empNo, password } = req.body;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || 'Browser';
      const result = await authService.forceLogin(empNo, password, ipAddress, userAgent);
      return sendSuccess(res, 'Force login successful. Other session terminated.', result);
    } catch (error) {
      return sendError(res, error.message, [], 401);
    }
  }

  async me(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.EmpNo);
      return sendSuccess(res, 'Profile retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res) {
    if (req.user?.EmpNo) {
      await authService.logout(req.user.EmpNo);
    }
    return sendSuccess(res, 'Logout successful', {});
  }
}

module.exports = new AuthController();
