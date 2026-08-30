import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    loading: store.loading,
    error: store.error,
    login: store.login,
    logout: store.logout,
    hasPermission: store.hasPermission,
    hasRole: store.hasRole,
  };
};
