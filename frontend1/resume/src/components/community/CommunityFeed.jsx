import React, { useState, useEffect } from "react";
import { getFeedPosts, createPost, voteOnPost, addComment, updateComment, deleteComment } from "../../services/communityApi";
import toast from 'react-hot-toast';

const CommunityFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await getFeedPosts();
      setPosts(response.posts || []);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert("Please enter both title and content");
      return;
    }

    try {
      setCreating(true);
      await createPost(newPostTitle, newPostContent);
      setNewPostTitle("");
      setNewPostContent("");
      setShowCreateModal(false);
      loadPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleVote = async (postId, voteType) => {
    try {
      const result = await voteOnPost(postId, voteType);
      
      // Update local state
      setPosts((prev) =>
        prev.map((p) =>
          p.postId === postId
            ? {
                ...p,
                votes: result.votes,
                upvotes: result.upvotes,
                downvotes: result.downvotes,
              }
            : p
        )
      );
    } catch (error) {
      console.error("Error voting on post:", error);
    }
  };

  const toggleComments = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const handleAddComment = async (postId) => {
    const content = commentText[postId]?.trim();
    if (!content) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const result = await addComment(postId, content);
      
      // Update local state
      setPosts((prev) =>
        prev.map((p) =>
          p.postId === postId
            ? {
                ...p,
                comments: [...(p.comments || []), result.comment],
                totalComments: result.totalComments
              }
            : p
        )
      );
      
      setCommentText({ ...commentText, [postId]: "" });
      toast.success("Comment added successfully!");
      loadPosts(); // Reload to get accurate comment count
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleEditComment = async (postId, commentId) => {
    const content = editCommentText.trim();
    if (!content) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      await updateComment(postId, commentId, content);
      
      // Update local state
      setPosts((prev) =>
        prev.map((p) =>
          p.postId === postId
            ? {
                ...p,
                comments: p.comments.map(c =>
                  c.commentId === commentId
                    ? { ...c, content, updatedAt: new Date() }
                    : c
                )
              }
            : p
        )
      );
      
      setEditingComment(null);
      setEditCommentText("");
      toast.success("Comment updated successfully!");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteComment(postId, commentId);
      
      // Update local state
      setPosts((prev) =>
        prev.map((p) =>
          p.postId === postId
            ? {
                ...p,
                comments: p.comments.filter(c => c.commentId !== commentId),
                totalComments: (p.totalComments || p.comments.length) - 1
              }
            : p
        )
      );
      
      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const startEditComment = (comment) => {
    setEditingComment(comment.commentId);
    setEditCommentText(comment.content);
  };

  const cancelEditComment = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  if (loading) {
    return (
      <div className="max-w-4xl text-white">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl text-white">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-3">
          Community
        </p>
        <h1 className="text-3xl font-medium tracking-tight">Discussions</h1>
        <p className="text-sm text-neutral-400 mt-2">
          Share updates, ask questions, and engage with students and alumni.
        </p>
      </div>

      {/* Create Post */}
      <div className="mb-6 border border-white/10 rounded-xl bg-neutral-950 p-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-neutral-500 hover:border-green-500 hover:text-neutral-300 transition text-left"
        >
          Create a post...
        </button>
      </div>

      {/* Feed */}
      {posts.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          <p>No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex gap-4 rounded-xl border border-white/10 bg-neutral-950 p-4"
            >
              {/* Votes */}
              <div className="flex flex-col items-center text-neutral-500">
                <button
                  onClick={() => handleVote(post.postId, "upvote")}
                  className={`hover:text-green-500 transition ${
                    post.upvotes?.includes(localStorage.getItem("resumate_user_id"))
                      ? "text-green-500"
                      : ""
                  }`}
                >
                  ▲
                </button>
                <span className="text-sm font-medium text-white">
                  {post.votes}
                </span>
                <button
                  onClick={() => handleVote(post.postId, "downvote")}
                  className={`hover:text-red-500 transition ${
                    post.downvotes?.includes(localStorage.getItem("resumate_user_id"))
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  ▼
                </button>
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Meta */}
                <div className="flex flex-wrap gap-2 text-xs text-neutral-500 mb-2">
                  <span className="text-neutral-300 font-medium">
                    {post.author}
                  </span>
                  <span>·</span>
                  <span>{post.role}</span>
                  <span>·</span>
                  <span>{post.timestamp}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-medium text-white mb-2">
                  {post.title}
                </h3>

                {/* Body */}
                <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                  {post.content}
                </p>

                {/* Actions */}
                <div className="flex gap-6 text-xs text-neutral-500">
                  <button 
                    onClick={() => toggleComments(post.postId)}
                    className="hover:text-white transition"
                  >
                    💬 {post.comments?.length || 0} comments
                  </button>
                  <button className="hover:text-white transition">Share</button>
                  <button className="hover:text-white transition">Save</button>
                </div>

                {/* Comments Section */}
                {expandedPost === post.postId && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    {/* Add Comment */}
                    <div className="mb-4">
                      <textarea
                        placeholder="Write a comment..."
                        value={commentText[post.postId] || ""}
                        onChange={(e) => setCommentText({ ...commentText, [post.postId]: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-neutral-500 resize-none focus:outline-none focus:border-green-500"
                        rows="2"
                      />
                      <button
                        onClick={() => handleAddComment(post.postId)}
                        className="mt-2 px-4 py-1.5 bg-green-500 hover:bg-green-400 text-black text-sm font-medium rounded-lg transition"
                      >
                        Comment
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3">
                      {(post.comments || []).map((comment) => (
                        <div key={comment.commentId} className="bg-black/30 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex gap-2 text-xs text-neutral-500">
                              <span className="text-neutral-300 font-medium">
                                {comment.userName}
                              </span>
                              <span>·</span>
                              <span>{comment.userRole}</span>
                              <span>·</span>
                              <span>
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                              {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                                <>
                                  <span>·</span>
                                  <span className="italic">edited</span>
                                </>
                              )}
                            </div>
                            
                            {/* Edit/Delete buttons - only show for comment author */}
                            {comment.userId === localStorage.getItem('resumate_user_id') && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => startEditComment(comment)}
                                  className="text-blue-400 hover:text-blue-300 text-xs"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(post.postId, comment.commentId)}
                                  className="text-red-400 hover:text-red-300 text-xs"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {editingComment === comment.commentId ? (
                            <div>
                              <textarea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-green-500"
                                rows="2"
                              />
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => handleEditComment(post.postId, comment.commentId)}
                                  className="px-3 py-1 bg-green-500 hover:bg-green-400 text-black text-xs font-medium rounded transition"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditComment}
                                  className="px-3 py-1 border border-white/10 text-white text-xs rounded hover:bg-white/5 transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-neutral-300">{comment.content}</p>
                          )}
                        </div>
                      ))}
                      
                      {(!post.comments || post.comments.length === 0) && (
                        <p className="text-center text-neutral-500 text-sm py-4">
                          No comments yet. Be the first to comment!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-8 w-full max-w-2xl">
            <h2 className="text-2xl font-medium mb-6">Create a Post</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Post Title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500"
              />

              <textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-neutral-500 h-40 resize-none focus:outline-none focus:border-green-500"
              />

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreatePost}
                  disabled={creating}
                  className="flex-1 rounded-full bg-green-500 py-2 text-black font-medium hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? "Posting..." : "Post"}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-full border border-white/10 py-2 text-white hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
