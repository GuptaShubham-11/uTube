import React, { useState, useEffect, useCallback } from 'react';
import { ListVideo, User, Trash2, Edit, Mail, SmilePlus, X, Heading, Text } from 'lucide-react';
import { playlistApi } from '../api/playlist.js';
import { useSelector } from 'react-redux';
import { SinglePlaylist, Button, Input, Alert } from '.';
import Modal from './Modal.jsx';

const Playlist = ({ channelId }) => {
  const user = useSelector((state) => state.auth.user);
  const [playlists, setPlaylists] = useState([]);
  const [playlistData, setPlaylistData] = useState({ name: '', description: '' });
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isOwner = user?._id === channelId;

  const fetchPlaylists = useCallback(async () => {
    try {
      setLoading(true);
      const response = await playlistApi.getAllPlaylist(channelId);
      if (response.statusCode < 400) {
        setPlaylists(response.message);
      } else {
        setAlert({ type: 'error', message: 'Failed to load playlists' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error fetching playlists' });
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaylistData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePlaylist = async () => {
    if (!playlistData.name || !playlistData.description) {
      setAlert({ type: 'warning', message: 'Name and Description are required' });
      return;
    }
    try {
      setLoading(true);
      const response = await playlistApi.createPlaylist(channelId, playlistData);
      if (response.statusCode < 400) {
        setPlaylists((prev) => [response.message, ...prev]); // Add new playlist to UI
        setPlaylistData({ name: '', description: '' }); // Reset input fields
        setAlert({ type: 'success', message: 'Playlist created successfully' });
      } else {
        setAlert({ type: 'error', message: 'Failed to create playlist' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error creating playlist' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlaylist = async () => {
    if (!playlistData.name || !playlistData.description) {
      setAlert({ type: 'warning', message: 'Name and Description are required' });
      return;
    }
    try {
      setLoading(true);
      const response = await playlistApi.updatePlaylist(editingPlaylist._id, playlistData);
      if (response.statusCode < 400) {
        setPlaylists((prev) =>
          prev.map((p) => (p._id === editingPlaylist._id ? response.message : p))
        );
        setEditingPlaylist(null);
        setPlaylistData({ name: '', description: '' });
        setIsEditModalOpen(false);
        setAlert({ type: 'success', message: 'Playlist updated successfully' });
      } else {
        setAlert({ type: 'error', message: 'Failed to update playlist' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error updating playlist' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async (playlistId, e) => {
    e.stopPropagation();
    try {
      setLoading(true);
      const response = await playlistApi.deletePlaylist(playlistId);
      if (response.statusCode < 400) {
        setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
        setAlert({ type: 'success', message: 'Playlist deleted successfully' });
      } else {
        setAlert({ type: 'error', message: 'Failed to delete playlist' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error deleting playlist' });
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (playlist, e) => {
    e.stopPropagation();
    setEditingPlaylist(playlist);
    setPlaylistData({ name: playlist.name, description: playlist.description });
    setIsEditModalOpen(true);
  };

  const cancelEditing = () => {
    setEditingPlaylist(null);
    setPlaylistData({ name: '', description: '' });
    setIsEditModalOpen(false);
  };

  const openPlaylist = (playlist) => {
    if (!editingPlaylist) {
      setSelectedPlaylist(playlist);
    }
  };

  const closePlaylist = () => {
    setSelectedPlaylist(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {alert && (
        <div className="fixed top-15 right-5 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}
      {selectedPlaylist ? (
        <SinglePlaylist playlist={selectedPlaylist} channelId={channelId} onClose={closePlaylist} />
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <ListVideo size={32} /> Your Playlists
          </h2>
          {isOwner && (
            <div className="w-full sm:w-3/4 md:w-1/2 mx-auto p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-800">
              <h3 className="font-semibold text-xl text-center mb-4">Create Playlist</h3>
              <Input
                type="text"
                name="name"
                placeholder="Playlist Name"
                icon={<User />}
                value={playlistData.name}
                onChange={handleInputChange}
              />
              <Input
                type="text"
                name="description"
                placeholder="Description"
                icon={<Mail />}
                value={playlistData.description}
                onChange={handleInputChange}
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
                className="py-3 w-full mt-4"
              />
            </div>
          )}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                className="border border-gray-300 dark:border-gray-700 shadow-md rounded-lg p-5 flex flex-col gap-3 hover:shadow-xl transition-transform hover:scale-105 bg-white dark:bg-gray-800 cursor-pointer relative"
                onClick={() => openPlaylist(playlist)}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {playlist.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{playlist.description}</p>
                {isOwner && (
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={(e) => startEditing(playlist, e)}
                      className="bg-green-500 hover:bg-green-700 p-2 rounded-full text-white"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={(e) => handleDeletePlaylist(playlist?._id, e)}
                      className="bg-red-500 hover:bg-red-700 p-2 rounded-full text-white"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {isEditModalOpen && (
        <Modal onClose={cancelEditing}>
          <h3 className="text-xl font-semibold mb-4">Edit Playlist</h3>
          <Input
            icon={<Heading />}
            type="text"
            name="name"
            value={playlistData.name}
            onChange={handleInputChange}
          />
          <Input
            icon={<Text />}
            type="text"
            name="description"
            value={playlistData.description}
            onChange={handleInputChange}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button
              text="Save"
              onClick={handleUpdatePlaylist}
              isLoading={loading}
              variant="secondary"
              className="px-4"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Playlist;
