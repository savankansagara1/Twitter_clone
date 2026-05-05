import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../api/auth.api";
import toast from "react-hot-toast";

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string; otp?: string } | null;

  // If accessed directly without going through forgot password, redirect back
  if (!state?.email) {
    navigate("/forgot-password");
    return null;
  }

  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(state.email!, otpInput, newPassword);
      toast.success("Password reset successfully! Please login.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* MOCK EMAIL DISPLAY */}
      {state?.otp && (
        <div className="w-full max-w-md bg-surface border border-primary rounded-xl p-6 mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          <span className="text-xs font-bold tracking-widest text-primary uppercase mb-2 block">Mock Email Delivery</span>
          <h2 className="text-lg text-textPrimary mb-2">Password Reset Code for {state.email}</h2>
          <div className="bg-background rounded-lg py-4 text-4xl font-mono tracking-widest text-textPrimary border border-border">
            {state.otp}
          </div>
          <p className="text-textSecondary text-sm mt-3">This code will expire in 5 minutes.</p>
        </div>
      )}

      {/* RESET PASSWORD FORM */}
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 24 24" className="w-10 h-10 fill-textPrimary">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-textPrimary mb-6 text-center">Reset your password</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            maxLength={6}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary placeholder-textSecondary outline-none focus:border-primary transition-colors text-center tracking-widest font-mono text-lg"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary placeholder-textSecondary outline-none focus:border-primary transition-colors"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary placeholder-textSecondary outline-none focus:border-primary transition-colors"
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-textPrimary text-black font-bold py-3 rounded-full hover:bg-white transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-textSecondary text-sm">
          <Link to="/login" className="hover:underline">
            Cancel and return to log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
