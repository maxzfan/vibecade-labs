import React from 'react';
import type { Game } from '../App';

interface GalleryProps {
    games: Game[];
}

const Gallery: React.FC<GalleryProps> = ({ games }) => {
    return (
        <div className="min-h-screen bg-white pt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-black">Game Gallery</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                        A collection of all the games you've published. Click any game to play!
                    </p>
                </header>

                {games.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500">You haven't published any games yet.</p>
                        <p className="mt-2 text-gray-500">Go to the Studio to create your first one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {games.map(game => (
                            <a 
                                key={game.id} 
                                href={`#/gallery/play/${game.id}`}
                                className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-black hover:shadow-lg transition-all"
                            >
                                <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                                    <div className="w-[1280px] h-[960px] transform scale-[0.27] sm:scale-[0.35] lg:scale-[0.29] origin-top-left pointer-events-none">
                                         <iframe
                                            srcDoc={game.code}
                                            title={`Preview of ${game.prompt}`}
                                            className="w-full h-full border-0"
                                            sandbox="allow-scripts"
                                            scrolling="no"
                                        />
                                    </div>
                                </div>
                                <div className="p-5">
                                    <p className="text-base font-semibold text-black truncate group-hover:text-orange-500 transition-colors" title={game.prompt}>
                                        {game.prompt}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Published on {new Date(game.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;