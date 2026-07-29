import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { getSocket } from '../services/socket';

const AccessRightsContext = createContext();

export const AccessRightsProvider = ({ children }) => {
  const { user } = useAuth();
  const [userPermissions, setUserPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMyPermissions = async () => {
    if (!user) {
      setUserPermissions({});
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/access-rights/my-permissions');
      setUserPermissions(res.data.data?.permissions || {});
    } catch (err) {
      console.error('Failed to fetch user access permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPermissions();

    if (!user) return;
    const socket = getSocket();
    socket.connect();

    const handleAccessRightsUpdated = () => {
      fetchMyPermissions();
    };

    socket.on('AccessRightsUpdated', handleAccessRightsUpdated);

    return () => {
      socket.off('AccessRightsUpdated', handleAccessRightsUpdated);
    };
  }, [user]);

  const userRole = user?.role || user?.SecurityRole || 'USER';

  const hasPageAccess = (moduleKey) => {
    if (userRole === 'SUPERADMIN') return true;
    const perm = userPermissions[moduleKey];
    return perm ? perm.enabled !== false : true;
  };

  const canMutate = (moduleKey) => {
    if (userRole === 'SUPERADMIN') return true;
    const perm = userPermissions[moduleKey];
    if (!perm || perm.enabled === false) return false;
    return perm.accessLevel === 'FULL_ACCESS';
  };

  return (
    <AccessRightsContext.Provider
      value={{
        userPermissions,
        loading,
        hasPageAccess,
        canMutate,
        refreshPermissions: fetchMyPermissions,
      }}
    >
      {children}
    </AccessRightsContext.Provider>
  );
};

export const useAccessRights = () => useContext(AccessRightsContext);
