const MESSAGES = {
  AUTH_SUCCESS: 'Authentication successful.',
  INVALID_CREDENTIALS: 'Invalid employee number or password.',
  UNAUTHORIZED: 'Unauthorized access. Token missing or invalid.',
  FORBIDDEN: 'Access denied. Insufficient permissions.',
  EMPLOYEE_NOT_FOUND: 'Employee not found.',
  POST_NOT_FOUND: 'Duty post not found.',
  DEVICE_NOT_FOUND: 'Biometric device not found.',
  DEPLOYMENT_NOT_FOUND: 'Deployment record not found.',
  VALIDATION_ERROR: 'Validation failed.',
  INTERNAL_SERVER_ERROR: 'Internal server error occurred.',
  DUPLICATE_PUNCH: 'Duplicate attendance punch detected.',
  ALLOCATION_SUCCESS: 'Guard allocation completed successfully.',
  ALLOCATION_FAILED: 'Guard allocation engine execution failed.',
};

module.exports = { MESSAGES };
