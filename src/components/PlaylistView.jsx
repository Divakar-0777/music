import React, { useState } from 'react';
import { Play, Clock, Heart, Trash2 } from 'lucide-react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

export const PlaylistView = ({ type, id, setCurrentView }) => {
  const { songs, playContext, userPlaylists, setUserPlaylists, favorites, setFavorites, currentSong, isPlaying } = useMusicPlayer();
  const [newPlaylistName, setNewPlaylistName] = useState('');

  let playlistSongs = [];
  let title = '';
  let description = '';

  if (type === 'favorites') {
    title = 'Liked Songs';
    description = 'Your favorite tracks';
    playlistSongs = songs.filter(s => favorites.includes(s.id));
  } else if (type === 'custom') {
    const p = userPlaylists.find(p => p.id === id);
    if (p) {
      title = p.name;
      description = `Custom Playlist • ${p.songs.length} songs`;
      playlistSongs = songs.filter(s => p.songs.includes(s.id));
    }
  }

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      playContext(playlistSongs, 0);
    }
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const newPlaylist = {
      id: Date.now(),
      name: newPlaylistName,
      songs: []
    };
    setUserPlaylists([...userPlaylists, newPlaylist]);
    setNewPlaylistName('');
    if (setCurrentView) {
      setCurrentView(`playlist-${newPlaylist.id}`);
    }
  };

  const toggleFavorite = (e, songId) => {
    e.stopPropagation();
    if (favorites.includes(songId)) {
      setFavorites(favorites.filter(id => id !== songId));
    } else {
      setFavorites([...favorites, songId]);
    }
  };

  const removeFromPlaylist = (e, songId) => {
    e.stopPropagation();
    if (type === 'custom') {
      setUserPlaylists(userPlaylists.map(p => {
        if (p.id === id) {
          return { ...p, songs: p.songs.filter(sid => sid !== songId) };
        }
        return p;
      }));
    }
  };
  
  const addToPlaylist = (e, songId, targetPlaylistId) => {
     e.stopPropagation();
     setUserPlaylists(userPlaylists.map(p => {
         if (p.id === targetPlaylistId && !p.songs.includes(songId)) {
            return { ...p, songs: [...p.songs, songId] };
         }
         return p;
     }));
  }

  if (type === 'create') {
    return (
      <div className="pb-24">
        <h1 className="text-4xl font-bold mb-8">Playlists</h1>
        <div className="bg-[#181818] p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-4">Create your playlist</h2>
          <input 
            type="text" 
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Playlist name"
            className="w-full bg-[#282828] text-white px-4 py-3 rounded-md mb-4 outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button 
            onClick={createPlaylist}
            className="bg-white text-black font-semibold px-6 py-3 rounded-full hover:scale-105 transition"
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="flex items-end mb-8 pt-10">
        <div className={`w-52 h-52 shadow-2xl flex items-center justify-center ${type==='favorites' ? 'bg-gradient-to-br from-indigo-600 to-blue-400' : 'bg-gradient-to-br from-zinc-700 to-zinc-900'}` }>
           {type === 'favorites' ? <Heart size={64} fill="white" /> : <Clock size={64} className="text-gray-400" />}
        </div>
        <div className="ml-6">
          <p className="text-sm font-semibold mb-2">Playlist</p>
          <h1 className="text-5xl lg:text-7xl font-black mb-6 truncate">{title}</h1>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
      
      <div className="mb-8">
        <button 
          onClick={handlePlayAll}
          className="bg-green-500 rounded-full p-4 hover:scale-105 transition hover:bg-green-400 flex items-center justify-center shadow-lg"
        >
          <Play fill="black" size={28} className="text-black ml-1" />
        </button>
      </div>
      
      <div className="text-gray-400">
        <div className="grid grid-cols-12 border-b border-[#282828] pb-2 mb-4 text-sm font-semibold tracking-wider px-4">
          <div className="col-span-1 text-right pr-4">#</div>
          <div className="col-span-5">Title</div>
          <div className="col-span-4">Category</div>
          <div className="col-span-2 text-right"></div>
        </div>
        
        {playlistSongs.length === 0 ? (
          <div className="text-center py-10 mt-8">No songs here yet. Start adding some!</div>
        ) : (
          playlistSongs.map((song, index) => {
            const isPlayingThis = currentSong?.id === song.id;
            return (
              <div 
                key={song.id} 
                className="grid grid-cols-12 items-center py-3 px-4 hover:bg-[#2a2a2a] rounded-md transition group cursor-pointer"
                onClick={() => playContext(playlistSongs, index)}
              >
                <div className="col-span-1 text-right pr-4">
                  {isPlayingThis && isPlaying ? (
                     <div className="text-green-500 text-sm">▶</div>
                  ) : (
                     <span className="group-hover:hidden">{index + 1}</span>
                  )}
                  {!isPlayingThis && <Play size={16} className="hidden group-hover:inline-block ml-auto" />}
                </div>
                <div className="col-span-5 flex items-center pr-4">
                  <img src={song.coverUrl} className="w-10 h-10 mr-4 object-cover rounded shadow" alt="cover" />
                  <div className="truncate">
                    <div className={`font-semibold ${isPlayingThis ? 'text-green-500' : 'text-white'}`}>{song.title}</div>
                    <div className="text-sm">{song.artist}</div>
                  </div>
                </div>
                <div className="col-span-4 text-sm truncate">
                  {song.category}
                </div>
                <div className="col-span-2 text-right flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => toggleFavorite(e, song.id)}>
                    <Heart size={18} fill={favorites.includes(song.id) ? "currentColor" : "none"} className={favorites.includes(song.id) ? "text-green-500" : "text-gray-400 hover:text-white transition"} />
                  </button>
                  {type === 'custom' && (
                    <button onClick={(e) => removeFromPlaylist(e, song.id)} className="text-gray-400 hover:text-white transition">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {type === 'custom' && (
         <div className="mt-12 border-t border-[#282828] pt-8 mx-4">
            <h2 className="text-xl font-bold mb-4">Recommended</h2>
            <p className="text-sm text-gray-400 mb-6">Add songs to this playlist</p>
            {songs.filter(s => !playlistSongs.some(p => p.id === s.id)).slice(0, 5).map((song) => (
               <div key={song.id} className="flex items-center justify-between py-2 hover:bg-[#2a2a2a] px-4 rounded transition group">
                  <div className="flex items-center">
                     <img src={song.coverUrl} className="w-10 h-10 mr-4 object-cover rounded" />
                     <div>
                        <div className="text-white font-semibold">{song.title}</div>
                        <div className="text-gray-400 text-sm">{song.artist}</div>
                     </div>
                  </div>
                  <button 
                     onClick={(e) => addToPlaylist(e, song.id, id)}
                     className="px-4 py-1 border border-gray-400 rounded-full text-sm font-semibold hover:border-white hover:text-white hover:scale-105 transition"
                  >
                     Add
                  </button>
               </div>
            ))}
         </div>
      )}
    </div>
  );
};
