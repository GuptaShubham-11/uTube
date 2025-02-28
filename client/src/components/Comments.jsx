import { useState, useEffect } from 'react';
import { UserRound, Trash2, Edit, ThumbsUp, MessageSquareText, Text } from 'lucide-react';
import { commentApi } from '../api/comment.js';
import { likeApi } from '../api/like.js';
import { useSelector } from 'react-redux';
import { Alert, Input, Button } from '../components';
import clsx from 'clsx';

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const videoOwnerId = useSelector((state) => state.video.video?.ownerDetails?._id);
  const isOwner = user?._id === videoOwnerId;

  const fetchComments = async () => {
    setLoading(true);
    const response = await commentApi.getAllVideoComments(videoId);
    setLoading(false);

    if (response?.statusCode < 400) {
      setComments(response.message?.comments || []);
    } else {
      setAlert({ type: 'error', message: 'Failed to fetch comments' });
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    setLoading(true);
    const response = await commentApi.addComment(videoId, user?._id, commentText);
    setLoading(false);

    if (response?.statusCode < 400) {
      fetchComments();
      setComments((prev) => [...prev, response.message]);
      setCommentText('');
    } else {
      setAlert({ type: 'error', message: 'Failed to add comment' });
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingText.trim()) return;

    setLoading(true);
    const response = await commentApi.updateComment(commentId, editingText);
    setLoading(false);

    if (response?.statusCode < 400) {
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, content: editingText } : c))
      );
      setEditingCommentId(null);
      setEditingText('');
    } else {
      setAlert({ type: 'error', message: 'Failed to update comment' });
    }
  };

  const handleDeleteComment = async (commentId) => {
    setLoading(true);
    const response = await commentApi.deleteComment(commentId);
    setLoading(false);

    if (response?.statusCode < 400) {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } else {
      setAlert({ type: 'error', message: 'Failed to delete comment' });
    }
  };

  const handleLikeComment = async (commentId) => {
    setLoading(true);
    const response = await likeApi.toggleCommentLike(commentId);
    setLoading(false);

    if (response?.statusCode >= 400) {
      setAlert({ type: 'error', message: 'Failed to like comment' });
    } else {
      fetchComments();
    }
  };

  return (
    <div className="mt-6">
      {alert && (
        <div className="fixed top-15 right-5 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}
      <div className="mb-6">
        <Input
          type="text"
          icon={<MessageSquareText />}
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          onClick={handleAddComment}
          text="Post"
          isLoading={loading}
          variant="primary"
          className="w-full py-2"
        />
      </div>

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4 rounded-lg border border-secondary-light dark:border-secondary-dark"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold flex items-center gap-2">
                  <UserRound size={18} /> {comment?.owner?.fullname || user?.fullname}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    text={
                      <ThumbsUp
                        size={16}
                        className={clsx({
                          'text-primary-light fill-primary-light dark:text-white dark:fill-white':
                            comment.isLiked,
                          'text-gray-500': !comment.isLiked,
                        })}
                      />
                    }
                    onClick={() => handleLikeComment(comment?._id)}
                    className="bg-transparent"
                  />
                  {comment?.owner?._id === user?._id && (
                    <Button
                      text={<Edit size={16} className={clsx('text-blue-500')} />}
                      onClick={() => {
                        setEditingCommentId(comment?._id);
                        setEditingText(comment.content);
                      }}
                      className="bg-transparent"
                    />
                  )}
                  {(comment?.owner?._id === user?._id || isOwner) && (
                    <Button
                      text={<Trash2 size={16} className={clsx('text-red-500')} />}
                      onClick={() => handleDeleteComment(comment?._id)}
                      className="bg-transparent"
                    />
                  )}
                </div>
              </div>
              {editingCommentId === comment._id ? (
                <div className="mt-2">
                  <Input
                    type="text"
                    icon={<Text />}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <div className="flex justify-start">
                    <Button
                      text="Update"
                      onClick={() => handleUpdateComment(comment._id)}
                      isLoading={loading}
                      className="mr-2 px-2 py-2 bg-green-700 rounded"
                    />
                    <Button
                      text="Cancel"
                      onClick={() => setEditingCommentId(null)}
                      variant="secondary"
                      className="px-2 py-2"
                    />
                  </div>
                </div>
              ) : (
                <p className="mt-2">{comment.content}</p>
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
