import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../api/auth.api";
import toast from "react-hot-toast";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form state for all required signup fields
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    dob: "",
    hashed_password: "",    // backend expects the field named "hashed_password"
    confirmPassword: "",
    country: "",
    bio: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.hashed_password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!form.fullname || !form.username || !form.email || !form.dob || !form.country) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await signUp({
        fullname: form.fullname,
        username: form.username,
        email: form.email,
        dob: form.dob,
        hashed_password: form.hashed_password,
        country: form.country,
        bio: form.bio,
      });
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <svg viewBox="0 0 24 24" className="w-10 h-10 fill-textPrimary mb-6">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>

        <h1 className="text-3xl font-bold text-textPrimary mb-6">Create your account</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field
            name="fullname"
            placeholder="Full Name *"
            value={form.fullname}
            onChange={handleChange}
          />
          <Field
            name="username"
            placeholder="Username *"
            value={form.username}
            onChange={handleChange}
          />
          <Field
            name="email"
            type="email"
            placeholder="Email *"
            value={form.email}
            onChange={handleChange}
          />
          <Field
            name="dob"
            type="date"
            placeholder="Date of Birth *"
            value={form.dob}
            onChange={handleChange}
          />
          <Field
            name="country"
            placeholder="Country *"
            value={form.country}
            onChange={handleChange}
          />
          <Field
            name="bio"
            placeholder="Bio (optional)"
            value={form.bio}
            onChange={handleChange}
          />
          <Field
            name="hashed_password"
            type="password"
            placeholder="Password *"
            value={form.hashed_password}
            onChange={handleChange}
          />
          <Field
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password *"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-full hover:bg-blue-400 transition-colors mt-2 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-textSecondary text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

// Reusable input field for signup form
interface FieldProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const Field: React.FC<FieldProps> = ({ name, placeholder, value, onChange, type = "text" }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-textPrimary placeholder-textSecondary outline-none focus:border-primary transition-colors"
  />
);

export default SignupPage;
