export default function SampleRoasts() {
  const samples = [
    {
      repo: "startup/monolith",
      stars: 42,
      issues: 156,
      roast: "This repo has more branches than your career options.",
    },
    {
      repo: "college/final-project",
      stars: 3,
      issues: 87,
      roast: "Your README is just vibes and a badge collection.",
    },
    {
      repo: "company/internal-tools",
      stars: 0,
      issues: 312,
      roast: "Test coverage so low it qualifies as a rounding error.",
    },
    {
      repo: "personal/weekend-app",
      stars: 1,
      issues: 42,
      roast: "More commented code than actual code. That's a choice.",
    },
    {
      repo: "freelance/client-project",
      stars: 0,
      issues: 203,
      roast: "Your commit messages tell a story. A sad story.",
    },
    {
      repo: "hobby/ml-experiment",
      stars: 5,
      issues: 89,
      roast: "99 bottles of tech debt on the wall, 99 bottles of tech debt.",
    },
  ];

  return (
    <section
      id="samples"
      className="py-12 sm:py-16 md:py-20 bg-black px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-pixel text-white text-center mb-12 sm:mb-16">
          SAMPLE ROASTS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {samples.map((sample, idx) => (
            <div
              key={idx}
              className="bg-gray-900 border-2 border-gray-700 hover:border-neon-cyan hover:shadow-lg hover:shadow-neon-cyan/30 transition-all hover:scale-105"
            >
              {/* Terminal header */}
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center gap-2">
                <div className="w-3 h-3 bg-neon-red rounded-full" />
                <div className="w-3 h-3 bg-neon-orange rounded-full" />
                <div className="w-3 h-3 bg-neon-cyan rounded-full" />
              </div>

              {/* Content */}
              <div className="p-6 font-mono space-y-3">
                <div>
                  <p className="text-neon-cyan text-sm">
                    $ repo --analyze {sample.repo}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    Stars: <span className="text-neon-orange">{sample.stars}</span>
                  </p>
                  <p className="text-gray-400 text-xs">
                    Open Issues: <span className="text-neon-red">{sample.issues}</span>
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700" />

                {/* Roast */}
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  "{sample.roast}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
