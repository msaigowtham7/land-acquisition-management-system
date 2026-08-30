import { create } from 'zustand';
import { User, UserRole, AuthState } from '@/types';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

// Mock user data for different roles
const mockUsers: Record<string, User> = {
  'central@ministry.gov': {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'central@ministry.gov',
    role: 'admin',
    department: 'Ministry of Rural Development',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=central',
    lastLogin: new Date(),
    status: 'active',
  },
  'state@officer.gov': {
    id: '2',
    name: 'Priya Singh',
    email: 'state@officer.gov',
    role: 'officer',
    department: 'State Revenue Department',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=state',
    lastLogin: new Date(),
    status: 'active',
  },
  'district@admin.gov': {
    id: '3',
    name: 'Anil Verma',
    email: 'district@admin.gov',
    role: 'officer',
    department: 'District Administration',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=district',
    lastLogin: new Date(),
    status: 'active',
  },
  'field@officer.gov': {
    id: '4',
    name: 'Deepak Patel',
    email: 'field@officer.gov',
    role: 'surveyor',
    department: 'Field Operations',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=field',
    lastLogin: new Date(),
    status: 'active',
  },
  'finance@dept.gov': {
    id: '5',
    name: 'Neha Gupta',
    email: 'finance@dept.gov',
    role: 'finance',
    department: 'Finance Department',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=finance',
    lastLogin: new Date(),
    status: 'active',
  },
  'rr@officer.gov': {
    id: '6',
    name: 'Suresh Kumar',
    email: 'rr@officer.gov',
    role: 'rr_officer',
    department: 'R&R Cell',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rr',
    lastLogin: new Date(),
    status: 'active',
  },
  'viewer@system.gov': {
    id: '7',
    name: 'Arjun Das',
    email: 'viewer@system.gov',
    role: 'viewer',
    department: 'Public Affairs',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viewer',
    lastLogin: new Date(),
    status: 'active',
  },
};

// Mock password for all users
const MOCK_PASSWORD = 'password123';

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: undefined,

  login: async (email: string, password: string) => {
    set({ loading: true, error: undefined });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const user = mockUsers[email.toLowerCase()];

      if (!user || password !== MOCK_PASSWORD) {
        set({
          loading: false,
          error: 'Invalid email or password',
          isAuthenticated: false,
        });
        return;
      }

      // Update last login
      user.lastLogin = new Date();

      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: undefined,
      });

      // Store in localStorage for session persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      set({
        loading: false,
        error: 'An error occurred during login',
        isAuthenticated: false,
      });
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: undefined,
    });

    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  },

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error?: string) => {
    set({ error });
  },

  clearError: () => {
    set({ error: undefined });
  },

  hasPermission: (permission: string) => {
    const { user } = get();
    if (!user) return false;

    const rolePermissions: Record<UserRole, string[]> = {
      admin: ['*'], // Admin has all permissions
      officer: [
        'view_projects',
        'edit_projects',
        'view_parcels',
        'approve_projects',
        'view_reports',
        'export_data',
      ],
      surveyor: [
        'view_assigned_parcels',
        'update_parcels',
        'upload_documents',
        'geotagging',
        'field_verification',
      ],
      finance: [
        'view_compensation',
        'process_payments',
        'view_financial_reports',
        'approve_payments',
      ],
      rr_officer: [
        'view_affected_families',
        'update_rr_status',
        'track_rehabilitation',
        'generate_rr_reports',
      ],
      viewer: ['view_projects', 'view_reports', 'export_reports'],
    };

    const permissions = rolePermissions[user.role] || [];
    return permissions.includes('*') || permissions.includes(permission);
  },

  hasRole: (roles: UserRole[]) => {
    const { user } = get();
    return user ? roles.includes(user.role) : false;
  },
}));
