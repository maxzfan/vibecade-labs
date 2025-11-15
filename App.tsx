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
    prompt:
      'A simple retro snake game with a score counter, dark theme, and neon green accents.',
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

// ---------- HEADER ----------

interface HeaderProps {
  activeTab: Page;
  onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onNavigate }) => {
  const linkClass = (page: Page) =>
    `transition-colors font-medium text-sm px-3 py-2 rounded-md ${
      activeTab === page ? 'text-black' : 'text-gray-500 hover:text-black'
    }`;

  const handleClick = (e: React.MouseEvent, page: Page) => {
    e.preventDefault();
    // Update hash so the router effect can pick it up (and deep links still work)
    switch (page) {
      case 'home':
        window.location.hash = '#/';
        break;
      case 'studio':
        window.location.hash = '#/studio';
        break;
      case 'gallery':
        window.location.hash = '#/gallery';
        break;
    }
    onNavigate(page);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a
          href="#/"
          onClick={(e) => handleClick(e, 'home')}
          className="text-xl font-bold tracking-wider text-black"
        >
          VIBECADE LABS
        </a>

        <nav className="hidden md:flex items-center space-x-2 bg-white/70 backdrop-blur-md p-1 rounded-lg border border-gray-200">
          <a
            href="#/"
            className={linkClass('home')}
            onClick={(e) => handleClick(e, 'home')}
          >
            Home
          </a>
          <a
            href="#/studio"
            className={linkClass('studio')}
            onClick={(e) => handleClick(e, 'studio')}
          >
            Studio
          </a>
          <a
            href="#/gallery"
            className={linkClass('gallery')}
            onClick={(e) => handleClick(e, 'gallery')}
          >
            Gallery
          </a>
        </nav>

        <a
          href="#/studio"
          onClick={(e) => handleClick(e, 'studio')}
          className="px-5 py-2 bg-black text-white font-semibold rounded-lg text-sm hover:bg-gray-800 transition-colors"
        >
          Get started - It's free
        </a>
      </div>
    </header>
  );
};

// ---------- APP ----------

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [gameId, setGameId] = useState<string | null>(null);
  const [initialPrompt, setInitialPrompt] = useState<string>('');
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    // Load games
    try {
      const savedGames = localStorage.getItem('vibecade-games');
      if (savedGames) {
        setGames(JSON.parse(savedGames));
      } else {
        setGames(defaultGames);
        localStorage.setItem('vibecade-games', JSON.stringify(defaultGames));
      }
    } catch (e) {
      console.error('Failed to load games from localStorage', e);
      localStorage.removeItem('vibecade-games');
      setGames(defaultGames);
    }

    const handleHashChange = () => {
      // Normalize hash: "#/studio?x=y" -> "studio?x=y"
      const raw = window.location.hash.replace(/^#\/?/, '');
      const [path, query] = raw.split('?');
      const searchParams = new URLSearchParams(query || '');
      const segments = path.split('/').filter(Boolean);

      // Reset view-specific state
      setGameId(null);
      setInitialPrompt('');

      const root = segments[0] || '';

      if (root === 'studio') {
        const promptFromUrl = searchParams.get('prompt');
        if (promptFromUrl) {
          setInitialPrompt(decodeURIComponent(promptFromUrl));
        }
        setPage('studio');
      } else if (root === 'gallery') {
        if (segments[1] === 'play' && segments[2]) {
          setGameId(segments[2]);
        }
        setPage('gallery');
      } else {
        setPage('home');
      }
    };

    handleHashChange(); // initial load
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handlePublishGame = (gameData: { prompt: string; code: string }): string => {
    const newGame: Game = {
      id: Date.now().toString(),
      ...gameData,
      createdAt: Date.now(),
    };

    setGames((prevGames) => {
      const updated = [newGame, ...prevGames];
      localStorage.setItem('vibecade-games', JSON.stringify(updated));
      return updated;
    });

    return newGame.id;
  };

  const handleTryGame = (prompt: string) => {
    window.location.hash = `#/studio?prompt=${encodeURIComponent(prompt)}`;
    setPage('studio');
    setInitialPrompt(prompt);
  };

  const renderPage = () => {
    if (gameId) {
      return <Play key={gameId} gameId={gameId} games={games} />;
    }

    switch (page) {
      case 'studio':
        return (
          <Studio
            key={initialPrompt}
            initialPrompt={initialPrompt}
            onPublish={handlePublishGame}
          />
        );
      case 'gallery':
        return <Gallery games={games} />;
      case 'home':
      default:
        return <Home onTryGame={handleTryGame} />;
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <Header activeTab={page} onNavigate={setPage} />
      <main className="pt-20">{/* pad for fixed header */}</main>
      {renderPage()}
    </div>
  );
};

export default App;
