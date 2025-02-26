import React, { useEffect, useState, useCallback } from 'react';
import { Video, Trash2, XCircle, PlusSquare } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setVideo } from '../features/videoSlice.js';
import { playlistApi } from '../api/playlist.js';
import { Button, Alert } from '../components';

const SinglePlaylist = ({ playlist, channelId, onClose }) => {
  const [videos, setVideos] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [alert, setAlert] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const availableVideos = useSelector((state) => state.video.allVideos);
  const user = useSelector((state) => state.auth.user);
  const isOwner = user._id === channelId;

  const fetchPlaylist = useCallback(async () => {
    try {
      const response = await playlistApi.getPlaylistById(playlist._id);
      if (response.statusCode < 400) {
        setVideos(response.message?.videos || []);
      }
    } catch (error) {
      setAlert({ message: 'Failed to load playlist videos.', type: 'error' });
    }
  }, [playlist._id]);

  useEffect(() => {
    fetchPlaylist();
  }, [fetchPlaylist]);

  const handleAddVideo = () => {
    if (selectedVideos.length === 0) {
      setAlert({ message: 'No videos selected!', type: 'warning' });
      return;
    }
    try {
      selectedVideos.forEach(async (videoId) => {
        await playlistApi.addVideoToPlaylist(playlist._id, videoId);
        fetchPlaylist();
      });
      setAlert({ message: 'Videos added successfully!', type: 'success' });
    } catch (error) {
      setAlert({ message: 'Error adding videos.', type: 'error' });
    } finally {
      setShowPopup(false);
      setSelectedVideos([]);
    }
  };

  const toggleVideoSelection = (id) => {
    setSelectedVideos((prev) => {
      const newSelection = new Set(prev);
      newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
      return Array.from(newSelection);
    });
  };

  const handleDeleteVideo = async (id) => {
    try {
      const response = await playlistApi.removeVideoFromPlaylist(playlist._id, id);
      if (response.statusCode < 400) {
        fetchPlaylist();
        setAlert({ message: 'Video removed successfully!', type: 'success' });
      }
    } catch (error) {
      setAlert({ message: 'Error removing video.', type: 'error' });
      console.error('Error deleting video:', error);
    }
  };

  return (
    <div className="p-6 relative">
      {alert && (
        <div className="fixed top-10 right-5 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}

      {/* Header Section */}
      {isOwner && (
        <div className="mb-6 flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Video size={28} /> {playlist.name}
            </h2>
            <p className="text-gray-500">{playlist.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              text={<PlusSquare size={28} className="text-blue-500 hover:text-blue-700" />}
              variant="primary"
              onClick={() => setShowPopup(true)}
              className="bg-transparent flex items-center gap-2"
            />
            <button onClick={onClose} className="text-red-600 hover:text-red-800">
              <XCircle size={28} />
            </button>
          </div>
        </div>
      )}

      {/* Video List Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map(({ _id, videoFile, title, description }) => (
          <div
            key={_id}
            className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 relative hover:scale-105 transition-transform cursor-pointer"
            onClick={() => {
              dispatch(setVideo({ video: { _id, videoFile, title, description } }));
              navigate(`/video`);
            }}
          >
            <iframe
              src={videoFile}
              title={title}
              className="w-full h-40 rounded mb-3"
              allowFullScreen
            ></iframe>
            <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{description}</p>
            {isOwner && (
              <button
                className="bg-red-600 hover:bg-red-700 p-2 rounded absolute top-3 right-3"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteVideo(_id);
                }}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Video Selection Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Select Videos</h3>
              <button onClick={() => setShowPopup(false)}>
                <XCircle size={24} className="text-red-600" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto mb-4">
              {availableVideos
                .filter(({ _id }) => !videos.some((video) => video._id === _id)) // Filter instead of map
                .map(({ _id, title }) => (
                  <div key={_id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedVideos.includes(_id)}
                      onChange={() => toggleVideoSelection(_id)}
                    />
                    <span className="ml-2">{title}</span>
                  </div>
                ))}
            </div>
            <Button
              text="Add Selected Videos"
              onClick={handleAddVideo}
              variant="secondary"
              className="w-full py-2"
              isLoading={selectedVideos.length === 0}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePlaylist;
