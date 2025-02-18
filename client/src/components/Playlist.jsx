import React, { useState, useEffect } from 'react';
import { ListVideo, PlusCircle, Trash2, Edit, Save } from 'lucide-react';
import { playlistApi } from '../api/playlist.js';
import { useSelector } from 'react-redux';

const Playlist = () => {
  const user = useSelector((state) => state.auth.user);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [updatedPlaylist, setUpdatedPlaylist] = useState({ name: '', description: '' });

  const fetchPlaylists = async () => {
    const response = await playlistApi.getAllPlaylist(user._id);
    if (response.statusCode < 400) setPlaylists(response.data);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async () => {
    if (!newPlaylist.name || !newPlaylist.description) return;
    const response = await playlistApi.createPlaylist(user._id, newPlaylist);

    if (response.statusCode < 400) {
      setPlaylists([...playlists, response.message]);
      setNewPlaylist({ name: '', description: '' });
    }
  };

  const handleDeletePlaylist = async (id) => {
    const response = await playlistApi.deletePlaylist(id);
    if (response.statusCode < 400) {
      setPlaylists(playlists.filter((playlist) => playlist._id !== id));
    }
  };

  const handleUpdatePlaylist = async () => {
    if (!updatedPlaylist.name || !updatedPlaylist.description) return;
    const response = await playlistApi.updatePlaylist(editingPlaylist._id, updatedPlaylist);
    if (response.statusCode < 400) {
      setPlaylists(playlists.map((p) => (p._id === editingPlaylist._id ? response.data : p)));
      setEditingPlaylist(null);
      setUpdatedPlaylist({ name: '', description: '' });
    }
  };

  const startEditing = (playlist) => {
    setEditingPlaylist(playlist);
    setUpdatedPlaylist({ name: playlist.name, description: playlist.description });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <ListVideo size={28} /> Your Playlists
      </h2>

      {/* Create Playlist Form */}
      <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex gap-4">
        <input
          type="text"
          placeholder="Playlist Name"
          value={newPlaylist.name}
          onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
          className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent"
        />
        <input
          type="text"
          placeholder="Description"
          value={newPlaylist.description}
          onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
          className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={handleCreatePlaylist}
        >
          <PlusCircle size={20} /> Create
        </button>
      </div>

      {/* Playlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist._id}
            className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 relative hover:scale-105 transition-transform"
          >
            <img
              src={playlist.thumbnail || '/default-thumbnail.png'}
              alt={playlist.name}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            {editingPlaylist?._id === playlist._id ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={updatedPlaylist.name}
                  onChange={(e) => setUpdatedPlaylist({ ...updatedPlaylist, name: e.target.value })}
                  className="p-2 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={updatedPlaylist.description}
                  onChange={(e) =>
                    setUpdatedPlaylist({ ...updatedPlaylist, description: e.target.value })
                  }
                  className="p-2 rounded border border-gray-300 dark:border-gray-600"
                />
                <button
                  onClick={handleUpdatePlaylist}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-2"
                >
                  <Save size={18} /> Save
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-2">{playlist.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{playlist.description}</p>
              </>
            )}

            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => startEditing(playlist)}
                className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDeletePlaylist(playlist._id)}
                className="bg-red-600 hover:bg-red-700 p-2 rounded"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
