import React from 'react';
import { Play } from 'lucide-react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

export const HomeView = () => {
  const { songs, playContext } = useMusicPlayer();
  
  const categories = songs.reduce((acc, song) => {
    if (!acc[song.category]) acc[song.category] = [];
    acc[song.category].push(song);
    return acc;
  }, {});

  const handlePlayCard = (categorySongs, startIndex) => {
    playContext(categorySongs, startIndex);
  };

  return (
    <div className="pb-24">
      <h1 className="text-3xl font-bold mb-8">Good morning</h1>
      
      {Object.entries(categories).map(([category, categorySongs]) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{category}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categorySongs.map((song, idx) => (
              <div 
                key={song.id} 
                className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition group cursor-pointer relative"
                onClick={() => handlePlayCard(categorySongs, idx)}
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
      ))}
    </div>
  );
};
