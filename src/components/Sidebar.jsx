import React from 'react';
import { Home, Search, Library, PlusSquare, Heart } from 'lucide-react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

export const Sidebar = ({ currentView, setCurrentView }) => {
  const { userPlaylists } = useMusicPlayer();

  return (
    <aside className="w-64 bg-black h-full flex flex-col p-6 text-gray-400">
      <div className="text-white text-2xl font-bold mb-8 cursor-pointer" onClick={() => setCurrentView('home')}>
        SpotifyClone
      </div>
      
      <nav className="space-y-4 mb-8">
        <button 
          className={`flex items-center space-x-3 hover:text-white transition-colors cursor-pointer w-full text-left ${currentView === 'home' ? 'text-white font-semibold' : ''}`}
          onClick={() => setCurrentView('home')}
        >
          <Home size={24} />
          <span>Home</span>
        </button>
        <button 
          className={`flex items-center space-x-3 hover:text-white transition-colors cursor-pointer w-full text-left ${currentView === 'search' ? 'text-white font-semibold' : ''}`}
          onClick={() => setCurrentView('search')}
        >
          <Search size={24} />
          <span>Search</span>
        </button>
      </nav>

      <div className="space-y-4 mb-6">
        <button 
          className={`flex items-center space-x-3 hover:text-white transition-colors cursor-pointer w-full text-left ${currentView === 'playlists' ? 'text-white font-semibold' : ''}`}
          onClick={() => setCurrentView('playlists')}
        >
          <PlusSquare size={24} />
          <span>Playlists</span>
        </button>
        <button 
          className={`flex items-center space-x-3 hover:text-white transition-colors cursor-pointer w-full text-left ${currentView === 'favorites' ? 'text-white font-semibold' : ''}`}
          onClick={() => setCurrentView('favorites')}
        >
          <Heart size={24} />
          <span>Liked Songs</span>
        </button>
      </div>
      
      <hr className="border-gray-800 mb-4" />
      
      <div className="flex-1 overflow-y-auto space-y-3">
        {userPlaylists && userPlaylists.map(playlist => (
          <p key={playlist.id} className="hover:text-white cursor-pointer text-sm truncate" onClick={() => setCurrentView(`playlist-${playlist.id}`)}>
            {playlist.name}
          </p>
        ))}
      </div>
    </aside>
  );
};
