import { Link } from "react-router-dom";

export default function NavBar() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-black border-b-2 border-neon-cyan/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-neon-cyan text-black font-pixel text-xs flex items-center justify-center hover:scale-110 transition-transform">
              🔥
            </div>
            <span className="font-pixel text-xs hidden sm:inline text-white hover:text-neon-cyan transition-colors">
              ROAST MY REPO
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="/"
              className="text-gray-400 font-mono text-xs hover:text-neon-cyan transition-colors"
            >
              ← Back to portfolio
            </a>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-white font-mono text-xs hover:text-neon-cyan transition-colors hover:underline"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection("samples")}
              className="text-white font-mono text-xs hover:text-neon-cyan transition-colors hover:underline"
            >
              Samples
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-white font-mono text-xs hover:text-neon-cyan transition-colors hover:underline"
            >
              FAQ
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-mono text-xs hover:text-neon-cyan transition-colors hover:underline"
            >
              About
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
