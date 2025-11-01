import { FaMoon, FaSun } from 'react-icons/fa'

function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className="bg-gradient-to-r from-primary to-green-600 dark:from-green-800 dark:to-green-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/cram.png" alt="CramItUp Logo" className="w-48 h-48 md:w-60 md:h-60 animate-pulse-slow float-animation" />
            <div>
              <h1 className="text-4xl md:text-5xl font-poppins font-extrabold tracking-tight">
                CramItUp
              </h1>
              <p className="text-sm md:text-base font-roboto mt-1 opacity-95">
                Cram Anything with a Twisted Grin! 😂💀
              </p>
            </div>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <FaSun className="text-2xl text-yellow-300" aria-hidden="true" />
            ) : (
              <FaMoon className="text-2xl text-blue-200" aria-hidden="true" />
            )}
          </button>
        </div>

        <p className="mt-4 text-base md:text-lg opacity-90 max-w-2xl">
          AI-powered mnemonics with humor, dark twists, and weird elements to make studying unforgettable!
        </p>
      </div>
    </header>
  )
}

export default Header
