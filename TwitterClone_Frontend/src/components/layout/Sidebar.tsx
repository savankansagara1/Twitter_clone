import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../shared/Avatar";

// Sidebar navigation — shown on all protected pages.
// On desktop (sm+): sticky left sidebar.
// On mobile: hidden behind a slide-in drawer toggled by a hamburger button.
const Sidebar: React.FC = () => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const navContent = (
    <div className="flex flex-col justify-between h-full">
      {/* Top: Logo + Nav */}
      <div className="flex flex-col gap-1">
        {/* X / Twitter Logo */}
        <Link
          to="/"
          className="flex items-center justify-center xl:justify-start p-3 rounded-full hover:bg-surface transition-colors mb-2"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-textPrimary">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Link>

        {/* Home */}
        <NavItem
          to="/"
          active={isActive("/")}
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          }
          label="Home"
        />

        {/* Profile */}
        <NavItem
          to={`/profile/${authUser?.username}`}
          active={location.pathname.startsWith("/profile")}
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          }
          label="Profile"
        />
      </div>

      {/* Bottom: User info + logout */}
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 rounded-full hover:bg-surface transition-colors text-left"
        >
          <Avatar username={authUser?.username} size="sm" />
          <div className="hidden xl:block overflow-hidden">
            <p className="text-textPrimary font-semibold text-sm truncate">
              {authUser?.username}
            </p>
            <p className="text-textSecondary text-xs truncate">{authUser?.email}</p>
          </div>
          <span className="hidden xl:block ml-auto text-textSecondary text-lg">···</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ─── Mobile hamburger button (visible only on xs screens) ─── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="sm:hidden fixed top-3 left-3 z-40 p-2 rounded-full bg-background border border-border text-textPrimary hover:bg-surface transition-colors"
        aria-label="Open menu"
      >
        {/* Hamburger icon */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      </button>

      {/* ─── Mobile drawer backdrop ─── */}
      {mobileOpen && (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ─── Mobile slide-in drawer ─── */}
      <aside
        className={`
          sm:hidden fixed top-0 left-0 z-50 h-screen w-72 bg-background border-r border-border
          px-4 py-6 flex flex-col transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close button inside drawer */}
        <button
          onClick={() => setMobileOpen(false)}
          className="self-end mb-4 text-textSecondary hover:text-textPrimary p-1 rounded-full transition-colors"
          aria-label="Close menu"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
        {navContent}
      </aside>

      {/* ─── Desktop sidebar (hidden on mobile, shown sm+) ─── */}
      <aside className="hidden sm:flex flex-col justify-between h-screen sticky top-0 w-16 xl:w-64 px-2 xl:px-4 py-4 border-r border-border">
        {navContent}
      </aside>

    </>
  );
};

// Reusable nav item
interface NavItemProps {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, active, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-4 p-3 rounded-full transition-colors hover:bg-surface w-fit xl:w-full ${
      active ? "font-bold text-textPrimary" : "text-textPrimary"
    }`}
  >
    <span className={active ? "text-primary" : "text-textPrimary"}>{icon}</span>
    <span className="hidden xl:block text-lg">{label}</span>
  </Link>
);

export default Sidebar;
