import React from 'react';
import { Sidebar } from './Sidebar';
import { PlayerFooter } from './PlayerFooter';

export const Layout = ({ children, currentView, setCurrentView }) => {
  return (
    <div className="flex flex-col h-screen bg-[#121212]">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#282828] to-[#121212] p-8 text-white relative">
          {children}
        </main>
      </div>
      <PlayerFooter />
    </div>
  );
};
