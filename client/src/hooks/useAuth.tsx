import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// Re-export the auth hook for consistency
export const useAuth = useAuthContext;

// Additional auth-related hooks can be added here if needed
export default useAuth;
