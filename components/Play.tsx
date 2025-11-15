import React, { useMemo } from 'react';
import type { Game } from '../App';

interface PlayProps {
    gameId: string;
    games: Game[];
}

const Play: React.FC<PlayProps> = ({ gameId, games }) => {
  const game = useMemo(() => games.find(g => g.id === gameId), [gameId, games]);
  
  const editUrl = useMemo(() => {
    if (game) {
        return `#/studio?prompt=${encodeURIComponent(game.prompt)}`;
    }
    return '#/studio';
  }, [game]);


  if (!game) {
    const error = games.length > 0 
        ? 'The requested game could not be found. It may have been deleted.' 
        : 'Could not find any saved games.';

    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4 bg-gray-50">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <a href="#/" 
          className="px-6 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <>
      <iframe
        srcDoc={game.code}
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