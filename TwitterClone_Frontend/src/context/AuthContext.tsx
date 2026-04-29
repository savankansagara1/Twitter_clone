import React, { createContext, useState, useEffect } from "react";
import type { AuthUser, AuthContextType } from "../types";

// Create the context with a default value of null
export const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider wraps the whole app and provides auth state to all children
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Try to restore auth state from localStorage on first load (persistent auth)
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  });

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (authUser) {
      localStorage.setItem("authUser", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [authUser]);

  // Called after a successful login
  const login = (
    token: string,
    user_id: number,
    username: string,
    email: string
  ) => {
    setAuthUser({ token, user_id, username, email });
  };

  // Called when user clicks logout
  const logout = () => {
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        login,
        logout,
        isAuthenticated: !!authUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
