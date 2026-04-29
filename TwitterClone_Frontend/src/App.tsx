import React from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./routes/AppRouter";

// Root component: wraps everything with AuthProvider so all pages have auth state
const App: React.FC = () => {
  return (
    <AuthProvider>
      {/* Toast notifications appear globally at the top-right */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#16181c",
            color: "#e7e9ea",
            border: "1px solid #2f3336",
          },
          success: { iconTheme: { primary: "#1d9bf0", secondary: "#000" } },
        }}
      />
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
