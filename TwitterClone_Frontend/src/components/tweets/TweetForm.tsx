import React, { useState, useRef } from "react";
import { createTweet } from "../../api/tweets.api";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../shared/Avatar";
import toast from "react-hot-toast";

interface TweetFormProps {
  onTweetCreated: () => void; // called after a tweet is created to refresh feed
}

const TweetForm: React.FC<TweetFormProps> = ({ onTweetCreated }) => {
  const { authUser } = useAuth();
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_CHARS = 280;
  const remaining = MAX_CHARS - content.length;

  // Handle image file selection and create a local preview URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Tweet cannot be empty");
      return;
    }
    if (remaining < 0) {
      toast.error("Tweet is too long");
      return;
    }

    // Build FormData because the backend expects multipart/form-data
    const formData = new FormData();
    formData.append("content", content.trim());
    if (file) {
      formData.append("file", file);
    }

    setLoading(true);
    try {
      await createTweet(formData);
      toast.success("Tweet posted!");
      // Reset form
      setContent("");
      setFile(null);
      setPreview(null);
      onTweetCreated(); // tell parent to reload feed
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to post tweet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-3 p-4 border-b border-border">
      <Avatar username={authUser?.username} size="md" />

      <div className="flex-1">
        {/* Text area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?!"
          rows={3}
          className="w-full bg-transparent text-textPrimary placeholder-textSecondary text-lg resize-none outline-none"
        />

       {preview && (
  <div className="relative mt-2">
    {/* Check if the file is a video or image */}
    {file?.type.startsWith("video/") ? (
      <video
        src={preview}
        className="rounded-2xl max-h-48 w-full object-cover"
        controls
      />
    ) : (
      <img
        src={preview}
        alt="preview"
        className="rounded-2xl max-h-48 object-cover"
      />
    )}
    
    <button
      onClick={() => { setFile(null); setPreview(null); }}
      className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
    >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-3 border-t border-border pt-3">
          {/* Image upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"
            title="Add image"
          >
            📷
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex items-center gap-3">
            {/* Character counter */}
            <span
              className={`text-sm ${
                remaining < 20 ? "text-red-500" : "text-textSecondary"
              }`}
            >
              {remaining}
            </span>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="bg-primary text-white font-semibold px-5 py-2 rounded-full text-sm disabled:opacity-50 hover:bg-blue-400 transition-colors"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetForm;
