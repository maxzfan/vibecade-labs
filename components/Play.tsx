import React, { useState, useEffect, useMemo } from 'react';

// Duplicating interface here as Play is a standalone page
interface Game {
  id: string;
  prompt: string;
  code: string;
  createdAt: number;
}

const Play: React.FC = () => {
  const [decodedCode, setDecodedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [originalPrompt, setOriginalPrompt] = useState<string>('');

  useEffect(() => {
    try {
      const gameId = window.location.hash.split('/play/')[1];
      if (!gameId) {
        setError('No game ID provided in the URL.');
        return;
      }

      const savedGamesJSON = localStorage.getItem('vibecade-games');
      if (!savedGamesJSON) {
        setError('Could not find any saved games.');
        return;
      }
      
      const savedGames: Game[] = JSON.parse(savedGamesJSON);
      const game = savedGames.find(g => g.id === gameId);

      if (game) {
        setDecodedCode(game.code);
        setOriginalPrompt(game.prompt);
      } else {
        setError('The requested game could not be found. It may have been deleted.');
      }
    } catch (e) {
      console.error('Failed to load game:', e);
      setError('The game data is invalid or corrupted.');
    }
  }, []);
  
  const editUrl = useMemo(() => {
    if (originalPrompt) {
        return `#/studio?prompt=${encodeURIComponent(originalPrompt)}`;
    }
    return '#/studio';
  }, [originalPrompt]);


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4 bg-gray-50">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <a href="/" 
          className="px-6 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </a>
      </div>
    );
  }

  if (decodedCode === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600">Loading Game...</p>
      </div>
    );
  }

  return (
    <>
      <iframe
        srcDoc={decodedCode}
        title="Vibecade Labs Game"
        className="w-full h-screen border-0"
        sandbox="allow-scripts allow-modals"
      />
       <a href={editUrl} className="absolute bottom-4 right-4 bg-white/80 text-black text-xs font-semibold px-4 py-2 rounded-full hover:bg-white transition-all backdrop-blur-sm border border-gray-200 shadow-md">
        Edit this game
      </a>
    </>
  );
};

export default Play;