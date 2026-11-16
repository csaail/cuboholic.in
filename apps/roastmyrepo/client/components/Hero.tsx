import { useState } from "react";

interface HeroProps {
  onRoast: (repoUrl: string) => void;
  isLoading?: boolean;
}

export default function Hero({ onRoast, isLoading }: HeroProps) {
  const [repoUrl, setRepoUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      onRoast(repoUrl);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-4 overflow-hidden">
      {/* Animated glitch background elements */}
      <div className="absolute top-10 right-10 w-20 h-20 border-2 border-neon-orange/30 opacity-50 animate-pulse" />
      <div className="absolute bottom-20 left-10 w-16 h-16 border-2 border-neon-red/30 opacity-50 animate-pulse" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Pixel character placeholder */}
        <div className="hidden lg:flex absolute -right-32 top-0 items-center justify-center opacity-50">
          <div className="text-6xl animate-bounce">🚀</div>
        </div>

        {/* Main content */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-pixel text-white mb-4 leading-tight">
            ROAST
            <br />
            MY REPO
          </h1>

          <p className="text-sm sm:text-base text-gray-300 mb-8 font-mono max-w-xl mx-auto">
            Paste your GitHub repo. Get emotionally destroyed by an AI comedian.
          </p>

          {/* Input and button */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/your-username/your-repo"
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-black border-2 border-neon-cyan text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-neon-cyan/80 focus:shadow-lg focus:shadow-neon-cyan/20 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-neon-cyan text-black font-pixel text-sm font-bold hover:scale-105 hover:shadow-lg hover:shadow-neon-cyan/50 transition-all disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap"
              >
                {isLoading ? "ROASTING..." : "ROAST"}
              </button>
            </div>
          </form>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 font-mono max-w-lg mx-auto leading-relaxed">
            We only read your code. We don't push… except emotionally.
          </p>
        </div>
      </div>
    </div>
  );
}
