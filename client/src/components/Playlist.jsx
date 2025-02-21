import React, { useState, useEffect } from 'react';
import { ListVideo, User, Trash2, Edit, Mail, SmilePlus } from 'lucide-react';
import { playlistApi } from '../api/playlist.js';
import { useSelector } from 'react-redux';
import { SinglePlaylist, Button, Input } from '.';

const Playlist = () => {
  const user = useSelector((state) => state.auth.user);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [updatedPlaylist, setUpdatedPlaylist] = useState({ name: '', description: '' });
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPlaylists = async () => {
    setLoading(true);
    const response = await playlistApi.getAllPlaylist(user._id);
    if (response.statusCode < 400) setPlaylists(response.message);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async () => {
    if (!newPlaylist.name || !newPlaylist.description) return;
    setLoading(true);
    const response = await playlistApi.createPlaylist(user._id, newPlaylist);
    if (response.statusCode < 400) {
      setPlaylists([...playlists, response.message]);
      setNewPlaylist({ name: '', description: '' });
    }
    setLoading(false);
  };

  const handleDeletePlaylist = async (id) => {
    setLoading(true);
    const response = await playlistApi.deletePlaylist(id);
    if (response.statusCode < 400) {
      setPlaylists(playlists.filter((playlist) => playlist._id !== id));
    }
    setLoading(false);
  };

  const handleUpdatePlaylist = async () => {
    if (!updatedPlaylist.name || !updatedPlaylist.description) return;
    setLoading(true);
    const response = await playlistApi.updatePlaylist(editingPlaylist._id, updatedPlaylist);
    if (response.statusCode < 400) {
      setPlaylists(playlists.map((p) => (p._id === editingPlaylist._id ? response.message : p)));
      setEditingPlaylist(null);
      setUpdatedPlaylist({ name: '', description: '' });
    }
    setLoading(false);
  };

  const startEditing = (playlist) => {
    setEditingPlaylist(playlist);
    setUpdatedPlaylist({ name: playlist.name, description: playlist.description });
  };

  const openPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  const closePlaylist = () => {
    setSelectedPlaylist(null);
  };

  return (
    <div className="p-6">
      {selectedPlaylist ? (
        <SinglePlaylist playlist={selectedPlaylist} onClose={closePlaylist} />
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <ListVideo size={32} /> Your Playlists
          </h2>

          <div className="mx-auto w-1/2 p-4 border border-secondary-light dark:border-secondary-dark rounded">
            <h3 className="font-semibold text-2xl text-center mb-4">Create Playlists</h3>
            <Input
              type="text"
              name="name"
              placeholder="Playlist Name"
              icon={<User />}
              value={newPlaylist.name}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
            />
            <Input
              type="text"
              name="description"
              placeholder="Description"
              icon={<Mail />}
              value={newPlaylist.description}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
            />
            <Button
              text={
                <span className="flex items-center justify-center gap-2">
                  <SmilePlus /> Create
                </span>
              }
              onClick={handleCreatePlaylist}
              isLoading={loading}
              variant="primary"
              className="w-full hover:brightness-125"
            />
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                className="border border-secondary-light dark:border-secondary-dark shadow-lg rounded-lg p-4 relative hover:scale-105 transition-transform cursor-pointer"
                onClick={() => openPlaylist(playlist)}
              >
                {editingPlaylist?._id === playlist._id ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      type="text"
                      name="name"
                      value={updatedPlaylist.name}
                      onChange={(e) =>
                        setUpdatedPlaylist({ ...updatedPlaylist, name: e.target.value })
                      }
                    />
                    <Input
                      type="text"
                      name="description"
                      value={updatedPlaylist.description}
                      onChange={(e) =>
                        setUpdatedPlaylist({ ...updatedPlaylist, description: e.target.value })
                      }
                    />
                    <Button
                      text="Save"
                      onClick={handleUpdatePlaylist}
                      isLoading={loading}
                      variant="secondary"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-2">{playlist.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{playlist.description}</p>
                  </>
                )}

                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(playlist);
                    }}
                    className="bg-green-500 hover:bg-green-700 p-2 rounded"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlaylist(playlist._id);
                    }}
                    className="bg-red-500 hover:bg-red-700 p-2 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Playlist;
