import React, { createContext, useState, useEffect, useRef } from 'react';
import initialSongs from '../data/songs.json';

export const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
  const [songs, setSongs] = useState(initialSongs);
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [originalQueue, setOriginalQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [history, setHistory] = useState([]);

  const [userPlaylists, setUserPlaylists] = useState(() => {
    const saved = localStorage.getItem('spotify-clone-playlists');
    return saved ? JSON.parse(saved) : [{ id: Date.now(), name: "My Playlist", songs: [1, 2] }];
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('spotify-clone-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const audioRef = useRef(new Audio());

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('spotify-clone-playlists', JSON.stringify(userPlaylists));
  }, [userPlaylists]);

  useEffect(() => {
    localStorage.setItem('spotify-clone-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const togglePlay = () => {
    if (!currentSong && queue.length > 0) {
      playSong(queue[0]);
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const playSong = (song) => {
    if (currentSong && currentSong.id === song.id && !isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    if (currentSong) {
      setHistory((prev) => [...prev, currentSong]);
    }

    setCurrentSong(song);
    audioRef.current.src = song.url;
    audioRef.current.play().catch(e => console.log('Audio playback prevented', e));
    setIsPlaying(true);
  };

  const shuffleArray = (array) => {
    let cloned = [...array];
    for (let i = cloned.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
    }
    return cloned;
  };

  const playNext = () => {
    if (!currentSong || queue.length === 0) return;

    if (shuffleMode) {
      const currentIndex = queue.findIndex(s => s.id === currentSong.id);
      if (currentIndex === -1 || currentIndex === queue.length - 1) {
        // Reached end of shuffled queue, reshuffle again
        const newQueue = shuffleArray(originalQueue);
        if (newQueue.length > 1 && newQueue[0].id === currentSong.id) {
          const temp = newQueue[0];
          newQueue[0] = newQueue[1];
          newQueue[1] = temp;
        }
        setQueue(newQueue);
        setHistory((prev) => [...prev, currentSong]);
        playSong(newQueue[0]);
        // Remove the duplicated currentSong history additions because playSong also adds to history
        // Wait, playSong adds to history! So we shouldn't do it here manually.
      } else {
        playSong(queue[currentIndex + 1]);
      }
    } else {
      const currentIndex = queue.findIndex(s => s.id === currentSong.id);
      if (currentIndex === -1 || currentIndex === queue.length - 1) {
        playSong(queue[0]);
      } else {
        playSong(queue[currentIndex + 1]);
      }
    }
  };

  const toggleShuffle = () => {
    if (!shuffleMode) {
      const remaining = originalQueue.filter(s => currentSong ? s.id !== currentSong.id : true);
      const shuffled = shuffleArray(remaining);
      if (currentSong) {
        setQueue([currentSong, ...shuffled]);
      } else {
        setQueue(shuffled);
      }
      setShuffleMode(true);
      setHistory([]);
    } else {
      setQueue(originalQueue);
      setShuffleMode(false);
    }
  };

  const playPrevious = () => {
    if (progress > 3) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      return;
    }
    
    if (history.length > 0) {
      const newHistory = [...history];
      const prevSong = newHistory.pop();
      setHistory(newHistory);
      
      setCurrentSong(prevSong);
      audioRef.current.src = prevSong.url;
      audioRef.current.play().catch(e => console.log('Audio playback prevented', e));
      setIsPlaying(true);
    } else {
      audioRef.current.currentTime = 0;
      setProgress(0);
    }
  };

  const playContext = (newContextQueue, startIndex = 0) => {
    setOriginalQueue(newContextQueue);
    if (shuffleMode) {
      const shuffled = shuffleArray(newContextQueue);
      const firstSong = newContextQueue[startIndex];
      const filtered = shuffled.filter(s => s.id !== firstSong.id);
      setQueue([firstSong, ...filtered]);
      setHistory([]);
      playSong(firstSong);
    } else {
      setQueue(newContextQueue);
      setHistory([]);
      playSong(newContextQueue[startIndex]);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);

    // We must capture the latest playNext by using a ref, or just relying on deps
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  // Handle ended event separately to avoid memory leaks or duplicate listeners
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => playNext();
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playNext]);

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        songs,
        currentSong,
        queue,
        originalQueue,
        isPlaying,
        progress,
        duration,
        volume,
        setVolume,
        shuffleMode,
        toggleShuffle,
        togglePlay,
        playNext,
        playPrevious,
        playContext,
        seek,
        history,
        userPlaylists,
        setUserPlaylists,
        favorites,
        setFavorites
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};
