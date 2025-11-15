import React from 'react';

const galleryItems = [
  {
    title: 'Retro Snake Game',
    description: 'A classic snake game where you control a snake to eat food and grow longer, with a score counter.',
    prompt: 'A simple retro snake game with a score counter, dark theme, and neon green accents.',
  },
  {
    title: 'Pomodoro Timer',
    description: 'A productivity timer that cycles through work and break periods to help you stay focused.',
    prompt: 'A minimalist Pomodoro timer with start, pause, and reset buttons. It should have a visual indicator for the time remaining.',
  },
  {
    title: 'Pixel Art Creator',
    description: 'A simple canvas for creating pixel art. Includes a color palette and a button to clear the grid.',
    prompt: 'A pixel art drawing app with a 16x16 grid. Include a small color palette and a "Clear" button.',
  },
  {
    title: 'Whack-a-Mole',
    description: 'The classic arcade game. Moles pop up from holes at random, and you score points by clicking them.',
    prompt: 'A "whack-a-mole" game with a 3x3 grid of holes. Moles should appear for a short time. Include a score display.',
  },
  {
    title: 'Minimalist Calculator',
    description: 'A clean, modern calculator that handles basic arithmetic operations like addition, subtraction, etc.',
    prompt: 'A simple calculator with a clean, light interface. It should support addition, subtraction, multiplication, division, and have a clear button.',
  },
  {
    title: 'Weather App',
    description: 'A basic app that fetches and displays the current weather for a city you enter.',
    prompt: 'A simple weather app. It should have an input field for a city name and a button. When clicked, it should show the current temperature for that city. Use a light, clean design.',
  },
    {
    title: 'To-Do List',
    description: 'A classic to-do list app to add, track, and complete tasks with a satisfying check-off animation.',
    prompt: 'A minimalist to-do list app. Users can add tasks, and check them off to mark as complete. Completed tasks should have a line-through. Use a clean, light theme.',
  },
];

const GradientBlob: React.FC = () => (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vh] max-w-4xl max-h-4xl">
      <div className="relative w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full blur-[150px] animate-blob-1"></div>
        <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-bl from-blue-500 to-teal-400 rounded-full blur-[120px] animate-blob-2 animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full blur-[100px] animate-blob-3 animation-delay-4000"></div>
      </div>
      <style>{`
        @keyframes blob-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes blob-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-20px, 30px) scale(1.1); }
          66% { transform: translate(30px, -20px) scale(0.9); }
        }
        @keyframes blob-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-15px, 10px) scale(1.1); }
          66% { transform: translate(10px, -15px) scale(0.9); }
        }
        .animate-blob-1 { animation: blob-1 10s infinite ease-in-out; }
        .animate-blob-2 { animation: blob-2 10s infinite ease-in-out; }
        .animate-blob-3 { animation: blob-3 10s infinite ease-in-out; }
        .animation-delay-2000 { animation-delay: -2s; }
        .animation-delay-4000 { animation-delay: -4s; }
      `}</style>
    </div>
);

interface HomeProps {
  onTryGame: (prompt: string) => void;
}

const Home: React.FC<HomeProps> = ({ onTryGame }) => {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-gray-50">
        <GradientBlob />
        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-8">
            <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter text-black">Vibecade</h1>
            <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter text-black">Labs</h1>
          </div>
          <div className="mt-12 max-w-4xl mx-auto bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-gray-200 shadow-sm">
             <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider">WELCOME TO VIBECADE LABS</p>
             <p className="mt-4 text-2xl md:text-3xl font-medium text-black leading-snug">
                The lab where imagination goes interactive. <br/>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Vibe it, build it, play it.</span>
             </p>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="py-20 bg-white">
        <div className="text-center mb-12 px-4">
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider">Inspiration</p>
            <h2 className="mt-2 text-4xl lg:text-5xl font-extrabold text-black">
                Build Your Own Retro Arcade
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                Explore some of the amazing mini-games you can create with Vibecade Labs. Click any example to load it in the studio!
            </p>
        </div>
        
        <div className="relative w-full overflow-hidden group">
            <div className="flex animate-scroll group-hover:pause">
                {[...galleryItems, ...galleryItems].map((item, index) => (
                    <div key={`${item.title}-${index}`} className="flex-shrink-0 w-80 mx-4">
                         <button 
                            onClick={() => onTryGame(item.prompt)}
                            className="w-full h-full bg-white p-6 rounded-2xl border border-gray-200 text-left flex flex-col items-start hover:border-black transition-colors"
                        >
                            <h3 className="text-xl font-bold text-black">{item.title}</h3>
                            <p className="mt-2 text-gray-500 flex-grow">{item.description}</p>
                            <span className="mt-4 text-sm font-semibold text-orange-500">Make this Game &rarr;</span>
                        </button>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
                .group:hover .animate-scroll {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
      </div>
    </div>
  );
};

export default Home;