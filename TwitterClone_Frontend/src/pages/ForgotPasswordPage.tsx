import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/auth.api";
import toast from "react-hot-toast";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email);
      // Backend responds with OTP (mocking email send)
      const { otp } = res.data;
      toast.success("OTP sent successfully!");
      // Navigate to reset password page, passing email and OTP
      navigate("/reset-password", { state: { email, otp } });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side — branding */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-40 h-40 fill-white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>

      {/* Right side — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <svg viewBox="0 0 24 24" className="w-10 h-10 fill-textPrimary mb-8 lg:hidden">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>

          <h1 className="text-3xl font-bold text-textPrimary mb-4">Find your X account</h1>
          <p className="text-textSecondary mb-8">Enter the email associated with your account to change your password.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-textPrimary placeholder-textSecondary outline-none focus:border-primary transition-colors"
            />
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-textPrimary text-black font-bold py-3 rounded-full hover:bg-white transition-colors disabled:opacity-60 mt-4"
            >
              {loading ? "Searching..." : "Next"}
            </button>
          </form>

          <p className="mt-8 text-textSecondary text-sm">
            Remember your password?{" "}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
