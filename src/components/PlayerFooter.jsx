import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

export const PlayerFooter = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious, progress, duration, seek, volume, setVolume, shuffleMode, toggleShuffle } = useMusicPlayer();

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    seek(Number(e.target.value));
  };

  if (!currentSong) return (
    <footer className="h-24 bg-[#181818] border-t border-[#282828] flex items-center justify-center text-gray-500">
      Select a song to start playing
    </footer>
  );

  return (
    <footer className="h-24 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between text-white select-none z-50">
      <div className="flex items-center w-1/3">
        <img src={currentSong.coverUrl} alt="cover" className="h-14 w-14 rounded-md object-cover" />
        <div className="ml-4">
          <div className="text-sm font-semibold hover:underline cursor-pointer">{currentSong.title}</div>
          <div className="text-xs text-gray-400 hover:underline cursor-pointer">{currentSong.artist}</div>
        </div>
      </div>
      
      <div className="flex flex-col items-center w-1/3">
        <div className="flex items-center space-x-6 mb-2">
          <button onClick={toggleShuffle} className={`${shuffleMode ? 'text-green-500 hover:text-green-400' : 'text-gray-400 hover:text-white'} transition`}>
            <Shuffle size={20} />
          </button>
          <button onClick={playPrevious} className="text-gray-400 hover:text-white transition">
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button onClick={togglePlay} className="bg-white text-black rounded-full p-2 hover:scale-105 transition">
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={playNext} className="text-gray-400 hover:text-white transition">
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>
        <div className="flex items-center w-full space-x-2 text-xs text-gray-400 group">
          <span>{formatTime(progress)}</span>
          <input 
            type="range" 
            min="0" 
            max={duration || 100} 
            value={progress} 
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-end w-1/3 space-x-3">
         <input 
           type="range" 
           min="0" max="1" step="0.01" 
           value={volume} 
           onChange={(e) => setVolume(Number(e.target.value))}
           className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white hover:accent-green-500" 
         />
      </div>
    </footer>
  );
};
