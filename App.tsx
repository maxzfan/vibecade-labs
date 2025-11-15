import React, { useState, useEffect } from 'react';
import Studio from './components/Studio';
import Play from './components/Play';
import Home from './components/Home';
import Gallery from './components/Gallery';
import { snakeGameCode } from './games/snake';
import { twenty48GameCode } from './games/2048';


export interface Game {
  id: string;
  prompt: string;
  code: string;
  createdAt: number;
}

type Page = 'home' | 'studio' | 'gallery';

const defaultGames: Game[] = [
    {
        id: 'default-snake',
        prompt: 'A simple retro snake game with a score counter, dark theme, and neon green accents.',
        code: snakeGameCode,
        createdAt: Date.now(),
    },
    {
        id: 'default-2048',
        prompt: 'A classic 2048 puzzle game with a retro theme.',
        code: twenty48GameCode,
        createdAt: Date.now() - 1000, 
    },
];


const Header: React.FC<{ activeTab: Page }> = ({ activeTab }) => {
  const linkClass = (page: Page) =>
    `transition-colors font-medium text-sm px-3 py-2 rounded-md ${
      activeTab === page
        ? 'text-black'
        : 'text-gray-500 hover:text-black'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="#/" className="text-xl font-bold tracking-wider text-black">
          VIBECADE LABS
        </a>
        <nav className="hidden md:flex items-center space-x-2 bg-white/70 backdrop-blur-md p-1 rounded-lg border border-gray-200">
          <a href="#/" className={linkClass('home')}>
            Home
          </a>
          <a href="#/studio" className={linkClass('studio')}>
            Studio
          </a>
          <a href="#/gallery" className={linkClass('gallery')}>
            Gallery
          </a>
        </nav>
        <a
          href="#/studio"
          className="px-5 py-2 bg-black text-white font-semibold rounded-lg text-sm hover:bg-gray-800 transition-colors"
        >
          Get started - It's free
        </a>
      </div>
    </header>
  );
};


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Page>('home');
  const [initialPrompt, setInitialPrompt] = useState<string>('');
  const [games, setGames] = useState<Game[]>([]);
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    try {
      const savedGames = localStorage.getItem('vibecade-games');
      if (savedGames) {
        setGames(JSON.parse(savedGames));
      } else {
        // If no games are saved, load the default games.
        setGames(defaultGames);
        localStorage.setItem('vibecade-games', JSON.stringify(defaultGames));
      }
    } catch (e) {
      console.error("Failed to load games from localStorage", e);
      localStorage.removeItem('vibecade-games');
      // Fallback to default games if parsing fails
      setGames(defaultGames);
    }

    const handleHashChange = () => {
      const currentHash = window.location.hash;
      setHash(currentHash);

      const [path, query] = currentHash.substring(1).split('?');
      const searchParams = new URLSearchParams(query || '');

      if (path.startsWith('/play/')) {
        // This is a play page, we don't need to set an activeTab.
        // It will be handled by the top-level render condition.
      } else if (path === '/studio' || (path === '/' && searchParams.has('prompt'))) {
        const promptFromUrl = searchParams.get('prompt');
        if (promptFromUrl) {
            setInitialPrompt(decodeURIComponent(promptFromUrl));
        } else {
            setInitialPrompt(''); // Clear prompt if navigating to studio without one
        }
        setActiveTab('studio');
      } else if (path === '/gallery') {
        setActiveTab('gallery');
      } else { // Home is default for '/', empty path etc.
        setActiveTab('home');
      }
    };
    
    handleHashChange(); // Run on initial load to set the correct state from URL
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handlePublishGame = (gameData: { prompt: string; code: string }): string => {
    const newGame: Game = {
      id: Date.now().toString(),
      ...gameData,
      createdAt: Date.now(),
    };
    
    setGames(prevGames => {
      const updatedGames = [newGame, ...prevGames];
      localStorage.setItem('vibecade-games', JSON.stringify(updatedGames));
      return updatedGames;
    });

    return newGame.id;
  };

  
  const isPlayPage = hash.startsWith('#/play/');

  const handleTryGame = (prompt: string) => {
    window.location.hash = `/studio?prompt=${encodeURIComponent(prompt)}`;
  };
  
  const renderPage = () => {
    switch (activeTab) {
      case 'studio':
        return <Studio key={initialPrompt} initialPrompt={initialPrompt} onPublish={handlePublishGame} />;
      case 'gallery':
        return <Gallery games={games} />;
      case 'home':
      default:
        return <Home onTryGame={handleTryGame}/>;
    }
  };

  if (isPlayPage) {
    return <Play key={hash} />;
  }

  return (
    <div className="min-h-screen font-sans">
      <Header activeTab={activeTab} />
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;