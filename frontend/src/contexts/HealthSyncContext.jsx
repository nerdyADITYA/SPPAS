import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import api from '../services/api';

const HealthSyncContext = createContext({
  syncSignal: 0,
  syncData: {
    status: 'ONLINE',
    database: 'CONNECTED',
    onlineDevicesCount: 0,
    totalDevicesCount: 0,
    activeDeploymentsCount: 0,
    lastAttendanceTime: null,
    lastDeploymentTime: null,
  },
  refetchSync: () => {},
});

export const HealthSyncProvider = ({ children }) => {
  const [syncSignal, setSyncSignal] = useState(0);
  const [syncData, setSyncData] = useState({
    status: 'ONLINE',
    database: 'CONNECTED',
    onlineDevicesCount: 0,
    totalDevicesCount: 0,
    activeDeploymentsCount: 0,
    lastAttendanceTime: null,
    lastDeploymentTime: null,
  });

  const prevSyncRef = useRef({
    lastAttendanceTime: null,
    lastDeploymentTime: null,
    onlineDevicesCount: 0,
  });

  const fetchSyncStatus = async () => {
    try {
      const res = await api.get('/health/sync-status');
      if (res.data && res.data.data) {
        const data = res.data.data;
        setSyncData(data);

        const prev = prevSyncRef.current;
        const attendanceChanged = data.lastAttendanceTime !== prev.lastAttendanceTime && data.lastAttendanceTime !== null;
        const deploymentChanged = data.lastDeploymentTime !== prev.lastDeploymentTime && data.lastDeploymentTime !== null;
        const deviceCountChanged = data.onlineDevicesCount !== prev.onlineDevicesCount;

        if (attendanceChanged || deploymentChanged || deviceCountChanged) {
          setSyncSignal((s) => s + 1);
        }

        prevSyncRef.current = {
          lastAttendanceTime: data.lastAttendanceTime,
          lastDeploymentTime: data.lastDeploymentTime,
          onlineDevicesCount: data.onlineDevicesCount,
        };
      }
    } catch (err) {
      console.warn('Health sync polling warning:', err.message);
    }
  };

  useEffect(() => {
    fetchSyncStatus();
    const interval = setInterval(() => {
      fetchSyncStatus();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <HealthSyncContext.Provider value={{ syncSignal, syncData, refetchSync: fetchSyncStatus }}>
      {children}
    </HealthSyncContext.Provider>
  );
};

export const useHealthSync = () => useContext(HealthSyncContext);
