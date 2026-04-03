import React, { useState } from 'react';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import { Layout } from './components/Layout';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { PlaylistView } from './components/PlaylistView';

function App() {
  const [currentView, setCurrentView] = useState('home');

  let View;
  if (currentView === 'home') {
    View = <HomeView />;
  } else if (currentView === 'search') {
    View = <SearchView />;
  } else if (currentView.startsWith('playlist-')) {
    const playlistId = parseInt(currentView.split('-')[1]);
    View = <PlaylistView type="custom" id={playlistId} />;
  } else if (currentView === 'favorites') {
    View = <PlaylistView type="favorites" />;
  } else if (currentView === 'playlists') {
    View = <PlaylistView type="create" setCurrentView={setCurrentView} />;
  } else {
    View = <HomeView />;
  }

  return (
    <MusicPlayerProvider>
      <Layout currentView={currentView} setCurrentView={setCurrentView}>
        {View}
      </Layout>
    </MusicPlayerProvider>
  );
}

export default App;
