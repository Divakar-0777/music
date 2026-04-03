import React, { useState } from 'react';
import { Play, Search } from 'lucide-react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

export const SearchView = () => {
  const { songs, playContext } = useMusicPlayer();
  const [query, setQuery] = useState('');

  const filteredSongs = songs.filter(s => 
    s.title.toLowerCase().includes(query.toLowerCase()) || 
    s.artist.toLowerCase().includes(query.toLowerCase()) ||
    s.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="pb-24">
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-3 text-gray-400" size={24} />
        <input 
          type="text" 
          placeholder="What do you want to listen to?"
          className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white rounded-full py-3 pl-12 pr-4 outline-none border border-transparent focus:border-white transition-colors"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <h2 className="text-2xl font-bold mb-4">Browse all</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredSongs.map((song, idx) => (
          <div 
            key={song.id} 
            className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition group cursor-pointer relative"
            onClick={() => playContext(filteredSongs, idx)}
          >
            <div className="relative mb-4">
              <img src={song.coverUrl} className="w-full aspect-square object-cover rounded-md shadow-lg" alt={song.title} />
              <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:scale-105 shadow-xl">
                <Play size={24} fill="black" className="text-black ml-1" />
              </button>
            </div>
            <h3 className="font-semibold truncate">{song.title}</h3>
            <p className="text-sm text-gray-400 mt-1 truncate">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
