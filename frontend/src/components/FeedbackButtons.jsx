import { useState } from 'react'
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'

function FeedbackButtons({ topic }) {
  const [feedback, setFeedback] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleFeedback = async (rating) => {
    setFeedback(rating)

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating, topic })
      })

      setSubmitted(true)

      // Track in Google Analytics
      if (window.gtag) {
        window.gtag('event', 'feedback', {
          feedback_type: rating,
          topic: topic.substring(0, 50)
        })
      }

      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
        setFeedback(null)
      }, 3000)

    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  if (submitted) {
    return (
      <div className="text-primary font-semibold animate-fade-in">
        Thanks for your feedback! 🙏
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Helpful?
      </span>
      <button
        onClick={() => handleFeedback('up')}
        className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
          feedback === 'up'
            ? 'bg-primary text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary/20'
        }`}
        aria-label="Thumbs up"
        title="This is helpful!"
      >
        <FaThumbsUp className="text-xl" aria-hidden="true" />
      </button>
      <button
        onClick={() => handleFeedback('down')}
        className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
          feedback === 'down'
            ? 'bg-accent text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-accent/20'
        }`}
        aria-label="Thumbs down"
        title="Not helpful"
      >
        <FaThumbsDown className="text-xl" aria-hidden="true" />
      </button>
    </div>
  )
}

export default FeedbackButtons
