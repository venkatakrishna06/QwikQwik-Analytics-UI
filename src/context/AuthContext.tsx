import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {jwtDecode} from 'jwt-decode';
import {toast} from 'sonner';
import {AuthResponse, authService, LoginCredentials} from '@/lib/api/services/auth.service';
import {tokenService} from '@/lib/token.service';
import {api} from '@/lib/api/axios';

interface User {
  id: number;
  staff?: any;
  email: string;
  name: string;
  role: string;
  staff_id?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to store user data in localStorage
  const storeUserData = (userData: User) => {
    const storage = tokenService.isPersistentSession() ? localStorage : sessionStorage;
    storage.setItem('user_data', JSON.stringify(userData));
  };

  // Function to retrieve user data from storage
  const getUserData = (): User | null => {
    try {
      const storage = tokenService.isPersistentSession() ? localStorage : sessionStorage;
      const userData = storage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  };

  // Function to clear user data from storage
  const clearUserData = () => {
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('user_data');
  };

  useEffect(() => {
    // Check if token exists and is valid on initial load
    const initAuth = async () => {
      try {
        // First try to get user from storage
        const storedUser = getUserData();

        if (storedUser && tokenService.isTokenValid()) {
          // If we have stored user data and token is valid, use it
          setUser(storedUser);

          // Set axios default header
          const token = tokenService.getToken();
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
        } else if (tokenService.isTokenValid()) {
          // Token is valid but no stored user, set user from token
          const token = tokenService.getToken();
          if (token) {
            const decoded = jwtDecode<any>(token);

            const userData = {
              id: parseInt(decoded.sub),
              email: decoded.email,
              name: decoded.name,
              role: decoded.role,
              staff_id: decoded.staff_id
            };

            setUser(userData);
            storeUserData(userData);

            // Set axios default header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
        } else {
          // Token is invalid, clear everything
          tokenService.clearTokens();
          clearUserData();
        }
      } catch (error) {
        // Error decoding token or fetching user, clear tokens and user data
        tokenService.clearTokens();
        clearUserData();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      // Set persistent session preference
      tokenService.setPersistentSession(rememberMe);

      // Call the login API
      const credentials: LoginCredentials = { email, password };
      const response: AuthResponse = await authService.login(credentials);

      // Store token in appropriate storage
      tokenService.setToken(response.token);

      // Store refresh token if provided
      if (response.refreshToken) {
        tokenService.setRefreshToken();
      }

      // Set user from response
      setUser(response.user_account);

      // Store user data in localStorage/sessionStorage
      storeUserData(response.user_account);

      // Set axios default header
      api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;

      toast.success('Login successful');
    } catch (error) {
      setError('Invalid credentials');
      toast.error('Invalid credentials');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      // Call logout API
      try {
        await authService.logout();
      } catch (error) {
        // Continue with logout even if API call fails
      }

      // Clear tokens
      tokenService.clearTokens();

      // Clear user data from storage
      clearUserData();

      // Clear user state
      setUser(null);

      // Clear axios default header
      delete api.defaults.headers.common['Authorization'];

      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
