import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../shared/Avatar";

// Sidebar navigation — shown on all protected pages
const Sidebar: React.FC = () => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper to highlight the active nav item
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="hidden sm:flex flex-col justify-between h-screen sticky top-0 w-16 xl:w-64 px-2 xl:px-4 py-4 border-r border-border">
      {/* Top section: Logo + Nav links */}
      <div className="flex flex-col gap-1">
        {/* Twitter/X logo */}
        <Link
          to="/"
          className="flex items-center justify-center xl:justify-start p-3 rounded-full hover:bg-surface transition-colors mb-2"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-textPrimary">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Link>

        {/* Navigation items */}
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

      {/* Bottom section: User info + logout */}
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
            <p className="text-textSecondary text-xs truncate">
              {authUser?.email}
            </p>
          </div>
          {/* Logout dots icon */}
          <span className="hidden xl:block ml-auto text-textSecondary text-lg">···</span>
        </button>
      </div>
    </aside>
  );
};

// Reusable nav item for the sidebar
interface NavItemProps {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, active, icon, label }) => (
  <Link
    to={to}
    className={`flex items-center gap-4 p-3 rounded-full transition-colors hover:bg-surface w-fit xl:w-full ${
      active ? "font-bold text-textPrimary" : "text-textPrimary"
    }`}
  >
    <span className={active ? "text-primary" : "text-textPrimary"}>{icon}</span>
    <span className="hidden xl:block text-lg">{label}</span>
  </Link>
);

export default Sidebar;
