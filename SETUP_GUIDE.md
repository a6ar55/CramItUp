# CramItUp - Quick Setup Guide 🚀

This guide will help you get CramItUp running in less than 5 minutes!

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (it starts with `AIza...`)

## Step 2: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm run install:all
```

This will install all dependencies for both frontend and backend.

## Step 3: Configure Environment Variables

1. Navigate to the backend folder:
```bash
cd backend
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Open the `.env` file in your editor and add your Gemini API key:
```
GEMINI_API_KEY=AIza...your_actual_key_here
PORT=3001
NODE_ENV=development
```

## Step 4: Run the Application

From the root directory, run:

```bash
npm run dev
```

This command starts:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000

## Step 5: Test It Out!

1. Open your browser to http://localhost:3000
2. You should see the CramItUp homepage
3. Try the example: "Planets in order from the Sun"
4. Click "Generate Magic" ✨

## Troubleshooting 🔧

### "API key not valid" error
- Double-check your API key in `backend/.env`
- Make sure there are no extra spaces or quotes
- Verify the key is active in Google AI Studio

### "Cannot find module" errors
- Run `npm run install:all` again
- Check that you have Node.js 18+ installed

### Backend not connecting
- Make sure port 3001 is not already in use
- Check that the backend server is running in the terminal

### Frontend won't load
- Clear your browser cache
- Try a different browser
- Make sure port 3000 is available

## Next Steps 📝

### Customize Your Deployment

1. **Google Analytics**: Replace `G-XXXXXXXXXX` in `frontend/index.html` with your GA4 tracking ID

2. **Buy Me a Coffee**: Update the link in `frontend/src/components/Footer.jsx`

3. **Google AdSense**: Add your AdSense code to the footer component

4. **Branding**: Customize colors in `frontend/tailwind.config.js`

### Deploy to Production

See the main README.md for deployment instructions to Vercel or Netlify.

## Support

If you run into issues:
1. Check the main README.md for detailed documentation
2. Open an issue on GitHub
3. Review the PRD.txt for feature specifications

Happy cramming! 🧠💥
