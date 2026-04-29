import React from "react";

interface AvatarProps {
  src?: string;       // Profile picture URL from backend
  username?: string;  // Used to show initials if no image
  size?: "sm" | "md" | "lg";
}

// Shows user profile picture, falls back to initials if no image
const Avatar: React.FC<AvatarProps> = ({ src, username, size = "md" }) => {
  const sizeMap = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-16 h-16 text-xl",
  };

  const initial = username ? username[0].toUpperCase() : "?";

  return src ? (
    <img
      src={src}
      alt={username}
      className={`${sizeMap[size]} rounded-full object-cover bg-surface flex-shrink-0`}
    />
  ) : (
    <div
      className={`${sizeMap[size]} rounded-full bg-primary flex items-center justify-center font-bold text-white flex-shrink-0`}
    >
      {initial}
    </div>
  );
};

export default Avatar;
