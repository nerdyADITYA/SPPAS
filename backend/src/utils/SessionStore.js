class SessionStore {
  constructor() {
    // Map of empNo -> { sessionId, token, ipAddress, userAgent, loginTime, lastActive }
    this.sessions = new Map();
    this.SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 Minutes Inactivity Timeout
  }

  createSession(empNo, token, sessionId, ipAddress = '127.0.0.1', userAgent = 'Browser') {
    const sessionData = {
      sessionId,
      empNo: String(empNo),
      token,
      ipAddress,
      userAgent,
      loginTime: new Date(),
      lastActive: new Date(),
    };
    this.sessions.set(String(empNo), sessionData);
    return sessionData;
  }

  getActiveSession(empNo) {
    const active = this.sessions.get(String(empNo));
    if (!active) return null;

    // Check if session has expired due to 15 minutes of inactivity
    const now = new Date().getTime();
    const lastActiveTime = new Date(active.lastActive).getTime();
    if (now - lastActiveTime > this.SESSION_TIMEOUT_MS) {
      this.sessions.delete(String(empNo));
      return null;
    }

    return active;
  }

  removeSession(empNo) {
    return this.sessions.delete(String(empNo));
  }

  hasSession(empNo) {
    return this.sessions.has(String(empNo));
  }

  isSessionValid(empNo, sessionId) {
    const active = this.getActiveSession(empNo);
    if (!active) return false;
    return active.sessionId === sessionId;
  }

  updateActivity(empNo) {
    const active = this.sessions.get(String(empNo));
    if (active) {
      active.lastActive = new Date();
    }
  }

  clearAll() {
    this.sessions.clear();
  }
}

module.exports = new SessionStore();
