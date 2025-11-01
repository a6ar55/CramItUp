import { FaCoffee, FaHeart, FaGithub } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-dark-card border-t-2 border-gray-200 dark:border-gray-700 mt-12">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Buy Me a Coffee */}
        <div className="text-center mb-6">
          <a
            href="https://buymeacoffee.com/a6ar55"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            aria-label="Support CramItUp on Buy Me a Coffee"
          >
            <FaCoffee className="text-xl" aria-hidden="true" />
            <span>Loved it? Fuel my coffee addiction! ☕</span>
          </a>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Support free tools for students!
          </p>
        </div>

        {/* Google AdSense */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-6">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-2466211514252229"
               data-ad-slot="auto"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>

        {/* Footer Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <FaHeart className="text-red-500 animate-pulse" aria-label="love" />
            <span>for students worldwide</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#about"
              className="hover:text-primary transition-colors duration-300"
            >
              About
            </a>
            <span>•</span>
            <a
              href="#privacy"
              className="hover:text-primary transition-colors duration-300"
            >
              Privacy
            </a>
            <span>•</span>
            <a
              href="https://github.com/a6ar55/cramitup"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors duration-300"
              aria-label="View source on GitHub"
            >
              <FaGithub aria-hidden="true" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 text-xs text-gray-500 dark:text-gray-500">
          <p>&copy; 2025 CramItUp. All rights reserved.</p>
          <p className="mt-1">
            Powered by Google Gemini AI | Optimized for exams in 2025
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
