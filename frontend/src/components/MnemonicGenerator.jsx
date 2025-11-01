import { useState } from 'react'
import { FaMagic, FaRedo } from 'react-icons/fa'
import MnemonicDisplay from './MnemonicDisplay'
import FeedbackButtons from './FeedbackButtons'

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Hindi',
  'Malayalam',
  'Telugu',
  'Tamil',
  'Arabic',
  'Chinese',
  'Japanese',
  'Korean',
  'Russian'
]

function MnemonicGenerator() {
  const [topic, setTopic] = useState('')
  const [language, setLanguage] = useState('English')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)

  const createConfetti = () => {
    const colors = ['#4CAF50', '#FF5722', '#2196F3', '#FFC107', '#9C27B0']
    const confettiCount = 50

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti'
      confetti.style.left = Math.random() * window.innerWidth + 'px'
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDelay = Math.random() * 0.5 + 's'
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's'
      document.body.appendChild(confetti)

      setTimeout(() => confetti.remove(), 3000)
    }
  }

  const handleGenerate = async (isRegenerate = false) => {
    if (!topic.trim()) {
      setError('Please enter a topic to memorize! 🤔')
      return
    }

    if (topic.length > 500) {
      setError('Topic is too long! Keep it under 500 characters. ✂️')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic, language })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong!')
      }

      setResult(data)

      // Show confetti on successful generation
      if (!isRegenerate) {
        createConfetti()
      }

      // Track event in Google Analytics
      if (window.gtag) {
        window.gtag('event', 'generate_mnemonic', {
          topic: topic.substring(0, 50),
          language: language,
          regenerate: isRegenerate
        })
      }

    } catch (err) {
      setError(err.message || 'Try again—Gemini is taking a nap! 😴')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = () => {
    handleGenerate(true)
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="card animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-poppins font-bold mb-6 text-gray-800 dark:text-dark-text">
          What do you want to memorize? 🎯
        </h2>

        <div className="space-y-4">
          {/* Topic Input */}
          <div>
            <label
              htmlFor="topic-input"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Enter your topic or text (max 500 characters)
            </label>
            <textarea
              id="topic-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Planets in order from the Sun, Periodic table groups, Historical dates..."
              className="input-field text-lg"
              rows="4"
              maxLength="500"
              aria-describedby="char-count"
              disabled={loading}
            />
            <p id="char-count" className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-right">
              {topic.length}/500 characters
            </p>
          </div>

          {/* Language Selection */}
          <div>
            <label
              htmlFor="language-select"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Select Language
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="select-field text-lg"
              disabled={loading}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="bg-red-100 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-center animate-slide-up"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={() => handleGenerate(false)}
            disabled={loading || !topic.trim()}
            className="btn-primary w-full flex items-center justify-center gap-3 text-xl"
            aria-label="Generate mnemonics"
          >
            {loading ? (
              <>
                <div className="spinner" aria-hidden="true"></div>
                <span>Conjuring Magic...</span>
              </>
            ) : (
              <>
                <FaMagic aria-hidden="true" />
                <span>Generate Magic ✨</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="animate-slide-up">
          <div className="text-center mb-4">
            <p className="text-2xl md:text-3xl font-poppins font-bold text-primary animate-bounce-slow">
              Boom! Your brain just leveled up! 🧠💥
            </p>
          </div>

          <MnemonicDisplay result={result} />

          {/* Regenerate and Feedback */}
          <div className="card mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="bg-accent hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              aria-label="Regenerate mnemonics"
            >
              <FaRedo aria-hidden="true" />
              <span>Try Another Twist! 🎲</span>
            </button>

            <FeedbackButtons topic={result.topic} />
          </div>
        </div>
      )}
    </div>
  )
}

export default MnemonicGenerator
