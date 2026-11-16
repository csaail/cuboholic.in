export default function Footer() {
  return (
    <footer className="bg-black border-t-2 border-neon-cyan/30 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          {/* Brand message */}
          <div>
            <p className="font-mono text-xs sm:text-sm text-gray-400 leading-relaxed">
              Built by developers with too many side projects.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-start sm:justify-end">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs hover:text-neon-cyan transition-colors"
            >
              GitHub
            </a>
            <a
              href="mailto:hello@roastmyrepo.dev"
              className="font-mono text-xs hover:text-neon-cyan transition-colors"
            >
              Contact
            </a>
            <a
              href="#report"
              className="font-mono text-xs hover:text-neon-cyan transition-colors"
            >
              Report a Bug
            </a>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="border-t border-neon-cyan/20 pt-6 sm:pt-8">
          <p className="font-mono text-xs text-gray-500 text-center">
            © 2024 Roast My Repo. All roasts are fictional and for entertainment.
          </p>
        </div>
      </div>
    </footer>
  );
}
