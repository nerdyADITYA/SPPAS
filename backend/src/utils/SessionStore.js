class SessionStore {
  constructor() {
    // Map of empNo -> Map<sessionId, sessionData>
    this.userSessions = new Map();
    this.SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 Minutes Inactivity Timeout
  }

  createSession(empNo, token, sessionId, ipAddress = '127.0.0.1', userAgent = 'Browser') {
    const key = String(empNo);
    if (!this.userSessions.has(key)) {
      this.userSessions.set(key, new Map());
    }

    const sessionData = {
      sessionId,
      empNo: key,
      token,
      ipAddress,
      userAgent,
      loginTime: new Date(),
      lastActive: new Date(),
    };

    const userMap = this.userSessions.get(key);
    userMap.set(sessionId, sessionData);
    return sessionData;
  }

  getActiveSession(empNo) {
    const key = String(empNo);
    const userMap = this.userSessions.get(key);
    if (!userMap || userMap.size === 0) return null;

    const now = new Date().getTime();
    let latestSession = null;

    for (const [sessionId, session] of userMap.entries()) {
      const lastActiveTime = new Date(session.lastActive).getTime();
      if (now - lastActiveTime > this.SESSION_TIMEOUT_MS) {
        userMap.delete(sessionId);
      } else {
        if (!latestSession || new Date(session.lastActive).getTime() > new Date(latestSession.lastActive).getTime()) {
          latestSession = session;
        }
      }
    }

    if (userMap.size === 0) {
      this.userSessions.delete(key);
    }

    return latestSession;
  }

  removeSession(empNo, sessionId = null) {
    const key = String(empNo);
    const userMap = this.userSessions.get(key);
    if (!userMap) return false;

    if (sessionId) {
      userMap.delete(sessionId);
      if (userMap.size === 0) this.userSessions.delete(key);
      return true;
    } else {
      return this.userSessions.delete(key);
    }
  }

  hasSession(empNo) {
    const key = String(empNo);
    const userMap = this.userSessions.get(key);
    return Boolean(userMap && userMap.size > 0);
  }

  isSessionValid(empNo, sessionId) {
    const key = String(empNo);
    const userMap = this.userSessions.get(key);
    if (!userMap) return false;

    const session = userMap.get(sessionId);
    if (!session) return false;

    const now = new Date().getTime();
    const lastActiveTime = new Date(session.lastActive).getTime();
    if (now - lastActiveTime > this.SESSION_TIMEOUT_MS) {
      userMap.delete(sessionId);
      if (userMap.size === 0) this.userSessions.delete(key);
      return false;
    }

    return true;
  }

  updateActivity(empNo, sessionId = null) {
    const key = String(empNo);
    const userMap = this.userSessions.get(key);
    if (!userMap) return;

    if (sessionId && userMap.has(sessionId)) {
      userMap.get(sessionId).lastActive = new Date();
    } else {
      for (const session of userMap.values()) {
        session.lastActive = new Date();
      }
    }
  }

  clearAll() {
    this.userSessions.clear();
  }
}

module.exports = new SessionStore();
