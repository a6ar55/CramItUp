# CramItUp - AI-Powered Mnemonic Generator 🧠💥

> Cram Anything with a Twisted Grin! 😂💀

CramItUp is a free, AI-powered web application that helps students memorize topics using creative mnemonics with humor, dark humor, and weird twists. Built with Google Gemini AI, React, and Express.

## Features ✨

- **AI-Powered Generation**: Uses Google Gemini 1.5 Flash for creative, context-aware mnemonics
- **Multilingual Support**: Generate mnemonics in 12+ languages (English, Spanish, French, Hindi, Arabic, and more)
- **Few-Shot Prompting**: Advanced AI prompting strategy ensures consistent, high-quality outputs
- **Dark Mode**: Toggle between light and dark themes for late-night studying
- **Examples Carousel**: Pre-loaded examples to showcase the tool's capabilities
- **Feedback System**: Anonymous thumbs up/down feedback for continuous improvement
- **Responsive Design**: Works seamlessly on mobile and desktop
- **SEO Optimized**: Comprehensive meta tags and schema markup for search visibility
- **Accessibility**: ARIA labels, keyboard navigation, and high contrast support

## Tech Stack 🛠️

### Frontend
- React 18
- Vite (fast build tool)
- Tailwind CSS (utility-first styling)
- React Icons

### Backend
- Node.js
- Express
- Google Generative AI SDK
- Express Rate Limit (API protection)

### Deployment
- Recommended: Vercel or Netlify
- Easy deployment from GitHub

## Installation 🚀

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/cramitup.git
cd cramitup
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Configure environment variables**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
```

4. **Run the development servers**

In the root directory:
```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:3001`
- Frontend on `http://localhost:3000`

5. **Open your browser**
Navigate to `http://localhost:3000`

## Project Structure 📁

```
cramitup/
├── backend/
│   ├── server.js           # Express server with Gemini integration
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Header.jsx
│   │   │   ├── ExamplesCarousel.jsx
│   │   │   ├── MnemonicGenerator.jsx
│   │   │   ├── MnemonicDisplay.jsx
│   │   │   ├── FeedbackButtons.jsx
│   │   │   └── Footer.jsx
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── index.html          # HTML template with SEO
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── package.json            # Root package.json
├── .gitignore
└── README.md
```

## Usage 💡

1. **Enter a topic** you want to memorize (e.g., "Planets in order from the Sun")
2. **Select your language** from the dropdown
3. **Click "Generate Magic"** to create mnemonics
4. **View results** with primary mnemonic + 2 alternatives
5. **Regenerate** for different variations
6. **Provide feedback** using thumbs up/down

## API Endpoints 🔌

### `POST /api/generate`
Generate mnemonics for a given topic.

**Request Body:**
```json
{
  "topic": "Planets from the Sun",
  "language": "English"
}
```

**Response:**
```json
{
  "success": true,
  "mnemonics": "Generated mnemonic text...",
  "topic": "Planets from the Sun",
  "language": "English"
}
```

### `POST /api/feedback`
Submit feedback for a mnemonic.

**Request Body:**
```json
{
  "rating": "up",
  "topic": "Planets from the Sun"
}
```

### `GET /api/health`
Health check endpoint.

## Customization ⚙️

### Update Languages
Edit `frontend/src/components/MnemonicGenerator.jsx`:
```javascript
const LANGUAGES = [
  'English',
  'Spanish',
  // Add more languages...
]
```

### Modify AI Prompts
Edit the `buildPrompt()` function in `backend/server.js` to adjust the few-shot examples and prompting strategy.

### Change Colors/Theme
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: '#4CAF50',    // Green
  accent: '#FF5722',     // Orange
  // Add your colors...
}
```

### Add Google Analytics
Replace the tracking ID in `frontend/index.html`:
```html
gtag('config', 'G-XXXXXXXXXX'); // Replace with your GA4 ID
```

### Add Google AdSense
Replace the ad placeholder in `frontend/src/components/Footer.jsx` with your AdSense code.

### Update Buy Me a Coffee Link
Edit `frontend/src/components/Footer.jsx`:
```jsx
href="https://buymeacoffee.com/yourprofile" // Update link
```

## Deployment 🌐

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Build frontend**
```bash
cd frontend && npm run build
```

3. **Deploy**
```bash
vercel
```

4. **Set environment variables** in Vercel dashboard:
- `GEMINI_API_KEY`

### Netlify

1. **Build frontend**
```bash
cd frontend && npm run build
```

2. **Deploy** via Netlify CLI or drag-and-drop

3. **Configure serverless functions** for backend API

## SEO Strategy 📈

The app implements advanced SEO techniques from the PRD:

### Technical SEO
- Core Web Vitals optimization
- Schema.org markup (WebApplication, FAQPage)
- Mobile-first responsive design
- Semantic HTML with proper headings

### On-Page SEO
- Meta tags optimized for target keywords
- Open Graph and Twitter Card tags
- Canonical URLs
- Image alt text

### Content Strategy (Recommended)
- Create blog posts on mnemonics and study techniques
- Build topical clusters around memory aids
- Guest post on educational sites
- Leverage social media (Reddit, TikTok)

## Performance Optimization 🚀

- Lazy loading for images
- Code splitting with Vite
- Tailwind CSS purging for minimal bundle size
- CDN for static assets (recommended)
- Rate limiting on API to prevent abuse

## Security 🔒

- Input sanitization to prevent XSS
- No user data storage
- API key hidden on backend
- CORS protection
- Rate limiting (30 requests per 15 minutes)

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Roadmap 🗺️

Future enhancements based on the PRD:

- [ ] User accounts for saving mnemonics
- [ ] Social sharing features
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] More languages (100+)
- [ ] Mnemonic editing and customization
- [ ] Community-contributed mnemonics
- [ ] Voice input support

## License 📄

MIT License - feel free to use for your own projects!

## Support ☕

If you find CramItUp helpful, consider:
- Starring the repo on GitHub ⭐
- Sharing with fellow students
- [Buying me a coffee](https://buymeacoffee.com/yourprofile) ☕

## Acknowledgments 🙏

- Google Gemini AI for powerful language generation
- The open-source community for amazing tools
- Students worldwide who inspired this project

## Contact 📧

For questions, suggestions, or issues:
- Open an issue on GitHub
- Email: your.email@example.com
- Twitter: [@yourusername](https://twitter.com/yourusername)

---

Made with ❤️ for students worldwide | Powered by Google Gemini AI
