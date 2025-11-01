import { useState, useEffect } from 'react'

function MnemonicDisplay({ result }) {
  const [showPrimary, setShowPrimary] = useState(false)
  const [showAlternatives, setShowAlternatives] = useState(false)

  // Staggered animations
  useEffect(() => {
    setTimeout(() => setShowPrimary(true), 100)
    setTimeout(() => setShowAlternatives(true), 500)
  }, [])

  // Handle both old and new response formats
  const mnemonicData = result.data || result.mnemonics;

  // If it's the old text format, show a message
  if (typeof mnemonicData === 'string') {
    return (
      <div className="card animate-slide-up">
        <div className="mb-4 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Topic: <span className="font-semibold text-gray-700 dark:text-gray-300">{result.topic}</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Language: <span className="font-semibold text-gray-700 dark:text-gray-300">{result.language}</span>
          </p>
        </div>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-roboto">{mnemonicData}</pre>
        </div>
      </div>
    );
  }

  // New JSON format
  const { primary, alternatives } = mnemonicData;

  // Clean up markdown formatting from mnemonic text
  const cleanMnemonic = (text) => {
    return text
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/\*/g, '')   // Remove italic markers
      .trim();
  };

  return (
    <div className="space-y-6">
      {/* Topic Info */}
      <div className="card bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-300 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-2xl flex-shrink-0">🎯</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
              Topic
            </p>
            <p className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 break-words">
              {result.topic}
            </p>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
              Language
            </p>
            <p className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">
              {result.language}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Mnemonic */}
      <div className={`transition-all duration-700 ${showPrimary ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 shadow-lg">
          <div className="relative">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
              <div className="text-3xl">🎯</div>
              <h3 className="text-base md:text-lg font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Primary Mnemonic
              </h3>
            </div>

            {/* The Mnemonic - BIG and READABLE */}
            <div className="relative mb-6 p-6 md:p-8 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-poppins font-bold text-gray-900 dark:text-white leading-relaxed animate-fade-in break-words">
                {cleanMnemonic(primary.mnemonic)}
              </p>
            </div>

            {/* Breakdown */}
            {primary.breakdown && primary.breakdown.length > 0 && (
              <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 md:p-6 border-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🔤</span>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Breakdown
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {primary.breakdown.map((item, index) => {
                    // Determine if text is long
                    const isLongText = item.represents.length > 20;
                    const isVeryLongText = item.represents.length > 40;

                    return (
                      <div
                        key={index}
                        className={`group flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-primary hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md ${
                          isVeryLongText ? 'md:col-span-2 xl:col-span-3' : isLongText ? 'md:col-span-2 xl:col-span-2' : ''
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className={`flex-shrink-0 ${
                          item.letter.length > 3 ? 'min-w-[3rem] h-12 text-base' : 'w-10 h-10 text-xl'
                        } bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-all duration-300 px-2`}>
                          <span className="break-words text-center leading-tight">
                            {item.letter}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`font-semibold text-gray-900 dark:text-white block ${
                            isLongText ? 'text-xs sm:text-sm' : 'text-sm'
                          } ${isVeryLongText ? 'break-words' : ''}`}>
                            {item.represents}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Explanation */}
            {primary.explanation && (
              <div className="relative bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 md:p-6 border-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-2 md:gap-3">
                  <span className="text-2xl md:text-3xl flex-shrink-0">💡</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Why It Sticks
                    </h4>
                    <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300 break-words">
                      {primary.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alternatives */}
      {alternatives && alternatives.length > 0 && (
        <div className={`space-y-4 transition-all duration-700 ${showAlternatives ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎲</span>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Try These Alternatives!
            </h3>
            <div className="flex-1 h-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            {alternatives.map((alt, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-xl p-1 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                  index === 0
                    ? 'bg-gradient-to-br from-orange-400 via-red-400 to-pink-500'
                    : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Animated glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>

                <div className="relative bg-white dark:bg-gray-900 rounded-lg p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <span className="text-xl md:text-2xl">{index === 0 ? '🎨' : '🌟'}</span>
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${
                      index === 0
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-purple-600 dark:text-purple-400'
                    }`}>
                      Alternative {index + 1}
                    </h4>
                  </div>

                  <p className={`text-xl sm:text-2xl md:text-3xl font-poppins font-bold leading-tight break-words ${
                    index === 0
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-400'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400'
                  }`}>
                    {cleanMnemonic(alt.mnemonic)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MnemonicDisplay;
