export default function HowItWorks() {
  const steps = [
    {
      icon: "📋",
      title: "Paste Your GitHub Repo",
      description: "We pretend to read all your code.",
    },
    {
      icon: "🤖",
      title: "AI Scans Your Chaos",
      description: "From TODOs to 3-month-old feature branches.",
    },
    {
      icon: "💥",
      title: "Receive Your Roast",
      description: "Brutal but strangely motivating.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-12 sm:py-16 md:py-20 bg-black border-t-2 border-b-2 border-neon-cyan/30 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-pixel text-white text-center mb-12 sm:mb-16">
          HOW IT WORKS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="border-2 border-neon-cyan/50 p-6 sm:p-8 hover:border-neon-cyan hover:shadow-lg hover:shadow-neon-cyan/20 transition-all hover:scale-105"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="font-pixel text-base sm:text-lg text-neon-cyan mb-3">
                {step.title}
              </h3>
              <p className="font-mono text-sm text-gray-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
