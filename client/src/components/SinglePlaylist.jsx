import React, { useEffect, useState } from 'react';
import { Video, CircleFadingPlus, Trash2, XCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setVideo } from '../features/videoSlice.js';
import { playlistApi } from '../api/playlist.js';

const SinglePlaylist = ({ playlist }) => {
  const [videos, setVideos] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const availableVideos = useSelector((state) => state.video.allVideos);

  const fetchPlaylist = async () => {
    try {
      const response = await playlistApi.getPlaylistById(playlist._id);
      if (response.statusCode < 400) {
        setVideos(response.message?.videos);
      }
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [playlist, videos]);

  const handleAddVideo = () => {
    const newVideos = availableVideos.filter((video) => selectedVideos.includes(video._id));
    newVideos.forEach(async (video) => {
      await playlistApi.addVideoToPlaylist(playlist._id, video._id);
    });
    setShowPopup(false);
    setSelectedVideos([]);
  };

  const toggleVideoSelection = (id) => {
    setSelectedVideos((prev) =>
      prev.includes(id) ? prev.filter((vid) => vid !== id) : [...prev, id]
    );
  };

  const handleDeleteVideo = async (id) => {
    const response = await playlistApi.removeVideoFromPlaylist(playlist._id, id);
    if (response.statusCode < 400) {
      fetchPlaylist();
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Video size={28} /> {playlist.name}
          </h2>
          <p className="text-gray-500">{playlist.description}</p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setShowPopup(true)}
        >
          <CircleFadingPlus size={20} /> Add Video
        </button>
      </div>

      {/* Video List Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video?._id}
            className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 relative hover:scale-105 transition-transform cursor-pointer"
            onClick={() => {
              dispatch(setVideo({ video: video }));
              navigate(`/video`);
            }}
          >
            <iframe
              src={video?.videoFile}
              title={video?.title}
              className="w-full h-40 rounded mb-3"
              allowFullScreen
            ></iframe>
            <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
              {video?.title}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{video?.description}</p>
            <button
              className="bg-red-600 hover:bg-red-700 p-2 rounded absolute top-3 right-3"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteVideo(video._id);
              }}
            >
              <Trash2 size={18} />
            </button>
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
              {availableVideos.map((video) => (
                <div
                  key={video._id}
                  className="flex items-center gap-3 p-2 border-b hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => toggleVideoSelection(video._id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedVideos.includes(video._id)}
                    readOnly
                    className="accent-blue-600"
                  />
                  <span className="text-lg text-gray-900 dark:text-white">{video.title}</span>
                </div>
              ))}
            </div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded disabled:opacity-60"
              onClick={handleAddVideo}
              disabled={selectedVideos.length === 0}
            >
              Add Selected Videos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePlaylist;
