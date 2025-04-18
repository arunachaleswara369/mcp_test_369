import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: number;
  email: string;
  full_name: string;
  profile_picture?: string;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextType {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development
const mockUser: User = {
  id: 1,
  email: "user@example.com",
  full_name: "John Doe",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const { toast } = useToast();

  // API base URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    // Check for token in localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.post(`${API_URL}/auth/token/`, { email, password });
      // const { access, refresh, user } = response.data;
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email !== "user@example.com" || password !== "password") {
        throw new Error("Invalid credentials");
      }
      
      const access = "mock_access_token";
      const refresh = "mock_refresh_token";
      
      // Store tokens and user data
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      setToken(access);
      setUser(mockUser);
      setStatus("authenticated");
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.detail || error.message || "Invalid credentials",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.post(`${API_URL}/auth/register/`, {
      //   email,
      //   password,
      //   full_name: fullName,
      // });
      // const { access, refresh, user } = response.data;
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        ...mockUser,
        email,
        full_name: fullName,
      };
      
      const access = "mock_access_token";
      const refresh = "mock_refresh_token";
      
      // Store tokens and user data
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      setToken(access);
      setUser(newUser);
      setStatus("authenticated");
      
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.response?.data?.detail || error.message || "Could not create account",
      });
      throw error;
    }
  };

  const logout = () => {
    // Clear tokens and user data
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    setToken(null);
    setUser(null);
    setStatus("unauthenticated");
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const resetPassword = async (email: string) => {
    try {
      // In a real app, this would be an API call
      // await axios.post(`${API_URL}/auth/reset-password/`, { email });
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error.response?.data?.detail || error.message || "Could not send reset email",
      });
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.patch(`${API_URL}/users/me/`, data, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      // const updatedUser = response.data;
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const updatedUser = {
        ...user,
        ...data,
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Profile update failed",
        description: error.response?.data?.detail || error.message || "Could not update profile",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        status,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};