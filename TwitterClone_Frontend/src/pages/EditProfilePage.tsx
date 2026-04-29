import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateProfile } from "../api/users.api";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/layout/Sidebar";
import Loader from "../components/shared/Loader";
import toast from "react-hot-toast";
import type { User } from "../types";

const EditProfilePage: React.FC = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form mirrors the updateUserProfile endpoint fields
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    dob: "",
    bio: "",
    country: "",
    profile_pic: "",
    cover_pic: "",
  });

  // Load existing profile data to pre-fill the form
  useEffect(() => {
    if (!authUser?.user_id) return;
    getUserById(authUser.user_id)
      .then((res) => {
        const u: User = res.data;
        setForm({
          fullname: u.fullname || "",
          username: u.username || "",
          email: u.email || "",
          dob: u.dob ? u.dob.split("T")[0] : "", // format to YYYY-MM-DD
          bio: u.bio || "",
          country: u.country || "",
          profile_pic: u.profile_pic || "",
          cover_pic: u.cover_pic || "",
        });
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [authUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser?.user_id) return;

    setSaving(true);
    try {
      await updateProfile(authUser.user_id, form);
      toast.success("Profile updated!");
      navigate(`/profile/${form.username}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 max-w-2xl border-x border-border">
        {/* Header */}
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3 z-10 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-textPrimary hover:bg-surface rounded-full p-2 transition-colors"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-textPrimary">Edit profile</h1>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
            <FormField
              label="Full Name"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              placeholder="Your full name"
            />
            <FormField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Your username"
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your email"
            />
            <FormField
              label="Date of Birth"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
            />
            <FormField
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Your country"
            />
            <div className="flex flex-col gap-1">
              <label className="text-textSecondary text-sm font-medium">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Tell the world about yourself"
                className="bg-surface border border-border rounded-lg px-4 py-3 text-textPrimary placeholder-textSecondary outline-none focus:border-primary resize-none"
              />
            </div>
            <FormField
              label="Profile Picture URL"
              name="profile_pic"
              value={form.profile_pic}
              onChange={handleChange}
              placeholder="https://..."
            />
            <FormField
              label="Cover Picture URL"
              name="cover_pic"
              value={form.cover_pic}
              onChange={handleChange}
              placeholder="https://..."
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary text-white font-bold py-3 rounded-full hover:bg-blue-400 transition-colors disabled:opacity-60 mt-2"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}
      </main>

      <aside className="hidden lg:block w-80" />
    </div>
  );
};

// Reusable labeled input field for edit form
interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-textSecondary text-sm font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-surface border border-border rounded-lg px-4 py-3 text-textPrimary placeholder-textSecondary outline-none focus:border-primary transition-colors"
    />
  </div>
);

export default EditProfilePage;
