import { useState, useEffect } from 'react';
import { UserRound, Trash2, Edit } from 'lucide-react';
import { commentApi } from '../api/comment.js';
import { useSelector } from 'react-redux';
import { Alert, Spinner, Input, Button } from '../components';

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState({ fetch: false, add: false, update: false, delete: false });
  const user = useSelector((state) => state.auth.user);

  // Fetch comments on mount
  const fetchComments = async () => {
    setLoading((prev) => ({ ...prev, fetch: true }));
    const response = await commentApi.getAllVideoComments(videoId);
    setLoading((prev) => ({ ...prev, fetch: false }));

    if (response?.statusCode < 400) {
      setComments(response.message?.comments || []);
    } else {
      setAlert({ type: 'error', message: response?.message || 'Failed to fetch comments' });
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  // Add a new comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setLoading((prev) => ({ ...prev, add: true }));
    const response = await commentApi.addComment(videoId, commentText);
    setLoading((prev) => ({ ...prev, add: false }));

    if (response?.statusCode < 400) {
      setComments([...comments, response.message]);
      setCommentText('');
    } else {
      setAlert({ type: 'error', message: response?.message || 'Failed to add comment' });
    }
  };

  // Update an existing comment
  const handleUpdateComment = async (commentId) => {
    if (!editingText.trim()) return;
    setLoading((prev) => ({ ...prev, update: true }));
    const response = await commentApi.updateComment(commentId, editingText);
    setLoading((prev) => ({ ...prev, update: false }));

    if (response?.statusCode < 400) {
      setComments((prev) => prev.map((c) => (c._id === commentId ? { ...c, content: editingText } : c)));
      setEditingCommentId(null);
      setEditingText('');
    } else {
      setAlert({ type: 'error', message: response?.message || 'Failed to update comment' });
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    setLoading((prev) => ({ ...prev, delete: true }));
    const response = await commentApi.deleteComment(commentId);
    setLoading((prev) => ({ ...prev, delete: false }));

    if (response?.statusCode < 400) {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } else {
      setAlert({ type: 'error', message: response?.message || 'Failed to delete comment' });
    }
  };

  return (
    <div className="mt-6">
      {alert && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}

      {/* Add Comment */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <Input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          icon={<UserRound />}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          onClick={handleAddComment}
          text={loading.add ? <Spinner /> : 'Post'}
          variant="secondary"
          className="mb-4 px-4 py-3"
        />
      </div>

      {/* Display Comments */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{user?.fullname || 'User'}</p>
                <div className="flex items-center gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => {
                      setEditingCommentId(comment._id);
                      setEditingText(comment.content);
                    }}
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

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
                    {loading.update ? <Spinner /> : 'Update'}
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
