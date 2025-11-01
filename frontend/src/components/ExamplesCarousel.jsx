import { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const examples = [
  {
    topic: "Planets from the Sun",
    mnemonic: "My Very Evil Mother Just Served Us Nachos... but poisoned them! 💀🌮",
    language: "English"
  },
  {
    topic: "Rainbow Colors",
    mnemonic: "Richard Of York Gave Battle In Vain... then became a ghost! 👻⚔️",
    language: "English"
  },
  {
    topic: "Periodic Table Groups",
    mnemonic: "Happy Hippos Never Openly Fight Gorillas... or they'll get nuked! 💥🦛",
    language: "English"
  },
  {
    topic: "Order of Operations (PEMDAS)",
    mnemonic: "Please Excuse My Dear Aunt Sally... she's a zombie now! 🧟‍♀️",
    language: "English"
  }
]

function ExamplesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextExample = () => {
    setCurrentIndex((prev) => (prev + 1) % examples.length)
  }

  const prevExample = () => {
    setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length)
  }

  return (
    <div className="mb-8 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-poppins font-bold text-center mb-4 text-gray-800 dark:text-dark-text">
        See It In Action! ⚡
      </h2>

      <div className="card relative overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={prevExample}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 flex-shrink-0"
            aria-label="Previous example"
          >
            <FaChevronLeft className="text-primary text-xl" aria-hidden="true" />
          </button>

          <div className="text-center flex-grow animate-slide-up" key={currentIndex}>
            <p className="text-sm font-semibold text-primary mb-2">
              Example: {examples[currentIndex].topic}
            </p>
            <p className="text-xl md:text-2xl font-poppins font-bold text-gray-800 dark:text-dark-text leading-relaxed">
              {examples[currentIndex].mnemonic}
            </p>
          </div>

          <button
            onClick={nextExample}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 flex-shrink-0"
            aria-label="Next example"
          >
            <FaChevronRight className="text-primary text-xl" aria-hidden="true" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {examples.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-primary w-6' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to example ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExamplesCarousel
