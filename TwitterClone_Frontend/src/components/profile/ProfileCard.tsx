import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { User } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import FollowButton from "../shared/FollowButton";
import Avatar from "../shared/Avatar";

interface ProfileCardProps {
  user: User;
}

// Shows the full user profile header (cover, avatar, bio, stats)
const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
}) => {
  const { authUser } = useAuth();
  const isOwnProfile = authUser?.user_id === user.user_id;
  
  const [currentFollowers, setCurrentFollowers] = useState(user.follower_count || 0);
  const [currentFollowing, setCurrentFollowing] = useState(user.following_count || 0);

  useEffect(() => {
    setCurrentFollowers(user.follower_count || 0);
    setCurrentFollowing(user.following_count || 0);
  }, [user]);

  const handleFollowToggle = (isFollowing: boolean) => {
    setCurrentFollowers((prev) => (isFollowing ? prev + 1 : Math.max(0, prev - 1)));
  };
  
  return (
    <div>
      {/* Cover photo */}
      <div className="h-32 sm:h-48 bg-surface">
        {user.cover_pic && (
          <img
            src={user.cover_pic}
            alt="cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="px-4 pb-4">
        {/* Avatar + action button row */}
        <div className="flex justify-between items-start -mt-12 mb-3">
          <Avatar src={user.profile_pic} username={user.username} size="lg" />

          {/* Show edit button if own profile, follow button otherwise */}
          {isOwnProfile ? (
            <Link
              to="/profile/edit"
              className="mt-14 px-4 py-1.5 border border-border rounded-full text-textPrimary text-sm font-semibold hover:bg-surface transition-colors"
            >
              Edit profile
            </Link>
          ) : (
            <div className="mt-14">
              <FollowButton 
                userId={user.user_id} 
                initialFollowing={user.is_following === 1 || user.is_following === true}
                onToggle={handleFollowToggle}
              />
            </div>
          )}
        </div>

        {/* Name and username */}
        <h1 className="text-xl font-bold text-textPrimary">{user.fullname}</h1>
        <p className="text-textSecondary">@{user.username}</p>

        {/* Bio */}
        {user.bio && (
          <p className="text-textPrimary mt-3 text-sm">{user.bio}</p>
        )}

        {/* Country + joined date */}
        <div className="flex gap-4 mt-2 text-textSecondary text-sm flex-wrap">
          {user.country && <span>📍 {user.country}</span>}
          <span>
            🗓 Joined{" "}
            {new Date(user.created_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Follower / following counts */}
        <div className="flex gap-5 mt-3 text-sm">
          <span>
            <strong className="text-textPrimary">{currentFollowing}</strong>{" "}
            <span className="text-textSecondary">Following</span>
          </span>
          <span>
            <strong className="text-textPrimary">{currentFollowers}</strong>{" "}
            <span className="text-textSecondary">Followers</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
