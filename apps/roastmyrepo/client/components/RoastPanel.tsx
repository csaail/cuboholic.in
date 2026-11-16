import { useEffect, useState } from "react";

interface RoastPanelProps {
  repoUrl: string | null;
  isLoading: boolean;
  roast: { headline: string; roasts: string[] } | null;
}

const loadingMessages = [
  "Cloning your shame…",
  "Counting TODOs and console.logs…",
  "Analyzing your commit messages…",
  "Discovering ancient commented code…",
  "Measuring test coverage (it's low)…",
  "Reading your README (it's vibes)…",
  "Generating deeply personal insults…",
];

export default function RoastPanel({
  repoUrl,
  isLoading,
  roast,
}: RoastPanelProps) {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="min-h-96 bg-black border-2 border-neon-cyan/30 rounded-none p-6 sm:p-8 font-mono">
      {/* Empty State */}
      {!isLoading && !roast && (
        <div className="flex items-center justify-center min-h-80 text-center">
          <div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Drop a repo above and we'll tell you why your tests are still
              TODO.
            </p>
            <p className="text-xs text-gray-500 mt-4 animate-pulse">
              ▯ Ready for roasting ▯
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <div>
            <p className="text-neon-cyan text-sm mb-4 animate-pulse">
              {loadingMessages[currentMessage]}
            </p>

            {/* Pixel progress bar */}
            <div className="bg-gray-900 border border-neon-cyan/50 h-4 overflow-hidden">
              <div
                className="bg-neon-cyan h-full transition-all duration-500"
                style={{
                  width: `${((currentMessage + 1) / loadingMessages.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <p className="text-gray-500 text-xs">
            Analyzing: <span className="text-neon-orange">{repoUrl}</span>
          </p>
        </div>
      )}

      {/* Result State */}
      {!isLoading && roast && (
        <div className="space-y-6">
          {/* Headline */}
          <div>
            <h2 className="text-neon-red font-pixel text-lg sm:text-xl leading-tight mb-4">
              {roast.headline}
            </h2>

            {/* Divider */}
            <div className="border-t border-neon-red/50 my-4" />
          </div>

          {/* Roast lines */}
          <div className="space-y-3">
            {roast.roasts.map((line, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="text-neon-orange flex-shrink-0">▶</span>
                <p className="text-gray-300 text-sm leading-relaxed">{line}</p>
              </div>
            ))}
          </div>

          {/* Repo info */}
          <div className="border-t border-neon-cyan/30 pt-4 mt-6">
            <p className="text-xs text-gray-500">
              Roasted: <span className="text-neon-cyan">{repoUrl}</span>
            </p>
          </div>

          {/* Action button */}
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-neon-cyan text-black font-pixel text-xs font-bold hover:scale-105 hover:shadow-lg hover:shadow-neon-cyan/50 transition-all"
          >
            ROAST ANOTHER
          </button>
        </div>
      )}
    </div>
  );
}
