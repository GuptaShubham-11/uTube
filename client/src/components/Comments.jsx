import { useState, useEffect } from 'react';
import { UserRound, Trash2, Edit } from 'lucide-react';
import { commentApi } from '../api/comment.js';
import { useSelector } from 'react-redux';

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const user = useSelector((state) => state.auth.user);

  // Fetch comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      const response = await commentApi.getAllVideoComments(videoId);

      if (response?.statusCode < 400) {
        setComments(response.message?.comments);
      } else {
        console.error('Failed to fetch comments');
      }
    };
    fetchComments();
  }, [videoId]);

  // Add a new comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const response = await commentApi.addComment(videoId, commentText);

    if (response?.statusCode < 400) {
      setComments((prev) => [...prev, response.message]);
      setCommentText('');
    } else {
      console.error(response?.message || 'Failed to add comment');
    }
  };

  // Update an existing comment
  const handleUpdateComment = async (commentId) => {
    if (!editingText.trim()) return;
    const response = await commentApi.updateComment(commentId, editingText);

    if (response?.statusCode < 400) {
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, content: editingText } : c))
      );
      setEditingCommentId(null);
      setEditingText('');
    } else {
      console.error(response?.message || 'Failed to update comment');
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    const response = await commentApi.deleteComment(commentId);

    if (response?.statusCode < 400) {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } else {
      console.error(response?.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="mt-6">
      {/* Add Comment */}
      <h3 className="text-xl font-semibold mb-3">Comments</h3>
      <div className="flex items-center gap-3 mb-6">
        <UserRound size={30} className="text-gray-600 dark:text-gray-300" />
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2 rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white focus:outline-none"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
        >
          Post
        </button>
      </div>

      {/* Display Comments */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between">
                <p className="font-semibold">{user?.fullname || 'User'}</p>
                <div className="flex items-center gap-2">
                  {/* Edit Button */}
                  <button
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => {
                      setEditingCommentId(comment._id);
                      setEditingText(comment.content);
                    }}
                  >
                    <Edit size={18} />
                  </button>

                  {/* Delete Button */}
                  <button
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Comment Content */}
              {editingCommentId === comment._id ? (
                <div className="mt-2">
                  <input
                    type="text"
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-black dark:text-white"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button
                    className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    onClick={() => handleUpdateComment(comment._id)}
                  >
                    Update
                  </button>
                  <button
                    className="mt-2 ml-2 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded"
                    onClick={() => setEditingCommentId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="mt-1">{comment.content}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment! 😊</p>
        )}
      </div>
    </div>
  );
};

export default Comments;
