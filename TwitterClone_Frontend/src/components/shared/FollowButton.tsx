import React, { useState } from "react";
import { followUser, unfollowUser } from "../../api/follows.api";
import toast from "react-hot-toast";

interface FollowButtonProps {
  userId: number;            // The user to follow/unfollow
  initialFollowing: boolean; // Is the current user already following them?
}

// Follow/Unfollow toggle button with optimistic UI update
const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  initialFollowing,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    // Optimistic update: flip state immediately for snappy UI
    const prevState = isFollowing;
    setIsFollowing(!isFollowing);

    try {
      if (prevState) {
        await unfollowUser(userId);
        toast.success("Unfollowed");
      } else {
        await followUser(userId);
        toast.success("Following!");
      }
    } catch {
      // Revert on error
      setIsFollowing(prevState);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all ${
        isFollowing
          ? "bg-transparent border border-border text-textPrimary hover:border-red-500 hover:text-red-500 hover:bg-red-500/10"
          : "bg-textPrimary text-black hover:bg-white"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
