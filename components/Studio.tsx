import React, { useState, useEffect, useCallback } from 'react';
import { generateCode } from '../services/geminiService';
import { CopyIcon, PublishIcon, SparklesIcon, SpinnerIcon } from './icons';

interface StudioProps {
  initialPrompt?: string;
  onPublish: (game: { prompt: string; code: string }) => string;
}

const Studio: React.FC<StudioProps> = ({ initialPrompt = '', onPublish }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [generatedCode, setGeneratedCode] = useState('');
  const [publishedUrl, setPublishedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your game.');
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedCode('');
    setPublishedUrl('');

    try {
      const code = await generateCode(prompt);
      setGeneratedCode(code);
    } catch (e) {
      console.error(e);
      setError('Failed to generate code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  const handlePublish = () => {
    if (!generatedCode) return;
    try {
      const newGameId = onPublish({ prompt, code: generatedCode });
      const url = `${window.location.origin}${window.location.pathname}#/gallery/play/${newGameId}`;
      setPublishedUrl(url);
    } catch (e) {
      console.error("Error publishing game:", e);
      setError("Could not publish game.");
    }
  };

  const handleCopy = () => {
    if (!publishedUrl) return;
    navigator.clipboard.writeText(publishedUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };
  
  return (
    <div className="flex flex-col lg:flex-row min-h-screen pt-20 bg-white">
      {/* Control Panel */}
      <div className="flex flex-col lg:w-2/5 xl:w-1/3 p-4 sm:p-6 lg:p-8 space-y-6 border-r border-gray-200">
        <header className="text-left">
          <h1 className="text-4xl lg:text-5xl font-bold text-black mt-1">Studio</h1>
          <p className="text-gray-500 mt-4">
            Describe the game you want to create, and our AI will bring it to life in seconds. The more descriptive you are, the better the result.
          </p>
        </header>

        <div className="flex-grow flex flex-col space-y-4">
          <label htmlFor="prompt" className="font-semibold text-gray-700">Your Game Idea</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A simple retro snake game with a score counter"
            className="flex-grow w-full p-3 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none resize-none text-gray-800 placeholder-gray-500"
            rows={8}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <SpinnerIcon /> : <SparklesIcon />}
            {isLoading ? 'Generating...' : 'Generate Game'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </div>

        {generatedCode && (
          <div className="p-4 bg-gray-100 rounded-lg border border-gray-200 space-y-3">
            {!publishedUrl ? (
                <button
                onClick={handlePublish}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                <PublishIcon />
                Publish & Get URL
                </button>
            ) : (
                <div>
                <label htmlFor="share-url" className="font-medium mb-2 text-gray-600 block">
                    Your Shareable URL:
                </label>
                <div className="relative flex items-center">
                    <input
                    id="share-url"
                    type="text"
                    readOnly
                    value={publishedUrl}
                    className="w-full p-2 pr-12 bg-white border border-gray-300 rounded-md text-blue-600"
                    />
                    <button
                    onClick={handleCopy}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-black rounded-md transition-colors"
                    title="Copy URL"
                    >
                    <CopyIcon isCopied={isCopied} />
                    </button>
                </div>
                {isCopied && <p className="text-green-600 text-xs mt-2 text-center">Copied to clipboard!</p>}
                </div>
            )}
            </div>
        )}
      </div>

      {/* Preview Area */}
      <div className="flex-grow flex flex-col bg-gray-100 m-4 sm:m-6 lg:m-8 rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-white px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Live Preview</h2>
        </div>
        <div className="flex-grow w-full h-full bg-white p-2">
          <iframe
            srcDoc={generatedCode}
            title="Vibecade Labs Preview"
            className="w-full h-full border-0 rounded-md"
            sandbox="allow-scripts allow-modals"
          />
        </div>
      </div>
    </div>
  );
};

export default Studio;