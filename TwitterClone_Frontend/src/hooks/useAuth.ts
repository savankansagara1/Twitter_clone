import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Custom hook to consume auth context from any component
// Throws an error if used outside of AuthProvider
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
