# CramItUp - Vercel Deployment Guide

## 📋 Overview

CramItUp is configured to deploy seamlessly on Vercel with:
- **Frontend**: React + Vite static site
- **Backend**: Serverless API functions
- **Zero configuration required** (uses vercel.json)

## 🚀 Quick Deploy

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/cramitup.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Add Environment Variable:**
   - In Vercel Dashboard → Project Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `your_actual_api_key`
   - Click "Save"

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add Environment Variable:**
   ```bash
   vercel env add GEMINI_API_KEY
   # Paste your API key when prompted
   ```

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

## 📁 Project Structure

```
cramitup/
├── api/                    # Serverless functions
│   ├── generate.js        # Main API endpoint
│   └── package.json       # API dependencies
├── frontend/              # React frontend
│   ├── src/
│   ├── dist/             # Build output (auto-generated)
│   └── package.json
├── backend/              # Local development server (not deployed)
│   └── server.js
├── vercel.json           # Deployment configuration
└── .gitignore
```

## ⚙️ How It Works

### Build Process

1. **Install Command** (runs first):
   ```bash
   cd frontend && npm install
   ```

2. **Build Command** (runs second):
   ```bash
   cd frontend && npm run build
   ```
   - Outputs to: `frontend/dist/`

3. **API Functions** (deployed separately):
   - Location: `/api/*.js`
   - Automatically deployed as serverless functions
   - Each file becomes an endpoint: `/api/generate` → `api/generate.js`

### Routing

Vercel automatically handles routing:

- `GET /` → Serves frontend (index.html)
- `GET /assets/*` → Serves static assets
- `POST /api/generate` → Executes serverless function

### Environment Variables

Required in Vercel Dashboard:
- `GEMINI_API_KEY`: Your Google Gemini API key

## 🔧 Configuration Details

### vercel.json

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "devCommand": "cd frontend && npm run dev",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

**Key Settings:**
- `memory: 1024`: Allocates 1GB RAM for API functions
- `maxDuration: 10`: Max 10 seconds per API call
- Rewrites ensure `/api/*` routes to serverless functions

## 🧪 Testing Production Build Locally

Before deploying, test the production build:

```bash
# Build frontend
cd frontend
npm run build

# Install Vercel CLI
npm i -g vercel

# Run local production server
vercel dev
```

Visit: `http://localhost:3000`

## 🐛 Troubleshooting

### Build Fails: "No Output Directory"

**Cause:** Build command didn't create `frontend/dist`

**Fix:**
```bash
cd frontend
npm run build
# Check if dist/ folder was created
ls -la dist/
```

### API Returns 500 Error

**Cause:** Missing `GEMINI_API_KEY`

**Fix:**
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Add `GEMINI_API_KEY`
4. Redeploy

### API Timeout

**Cause:** Gemini API taking too long (>10s)

**Fix:** Increase `maxDuration` in vercel.json:
```json
"functions": {
  "api/**/*.js": {
    "maxDuration": 30
  }
}
```

### CORS Errors

**Cause:** Missing CORS headers in API function

**Fix:** Already handled in `api/generate.js`:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
```

## 📊 Monitoring

### Check Deployment Status
- Vercel Dashboard → Deployments
- View build logs
- See runtime logs

### Check Function Logs
- Vercel Dashboard → Functions
- Click on `/api/generate`
- View real-time logs

### Performance Metrics
- Vercel Dashboard → Analytics
- Monitor response times
- Track error rates

## 🔐 Security Checklist

Before deploying:

- ✅ `.env` file is in `.gitignore`
- ✅ `GEMINI_API_KEY` is in Vercel Environment Variables (NOT in code)
- ✅ Input sanitization enabled in `api/generate.js`
- ✅ Rate limiting configured (client-side)
- ✅ No sensitive data in frontend code

## 🚦 Post-Deployment

After successful deployment:

1. **Test the live site:**
   - Visit your Vercel URL
   - Generate a mnemonic
   - Test multiple languages
   - Check dark mode

2. **Set up custom domain** (optional):
   - Vercel Dashboard → Settings → Domains
   - Add your custom domain
   - Update DNS records

3. **Enable Analytics** (optional):
   - Vercel Dashboard → Analytics
   - Enable Web Analytics

4. **Set up monitoring:**
   - Google Analytics (already configured in index.html)
   - Vercel Analytics

## 📈 Scaling

Vercel automatically scales your app:

- **Serverless functions**: Auto-scale with traffic
- **CDN**: Static assets cached globally
- **Edge Network**: Served from nearest location

**Free Tier Limits:**
- 100GB bandwidth/month
- 100 serverless function invocations/hour
- Unlimited static requests

**To upgrade:**
- Vercel Dashboard → Settings → Plans

## 🔄 Continuous Deployment

Vercel automatically deploys on every push:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update features"
   git push
   ```

2. **Auto-deploy:**
   - Vercel detects the push
   - Builds automatically
   - Deploys to production

3. **Preview Deployments:**
   - Each branch gets a preview URL
   - Test before merging to main

## 🌐 Custom Domain Setup

1. **Add domain in Vercel:**
   - Settings → Domains → Add
   - Enter: `cramitup.com`

2. **Update DNS (Namecheap, GoDaddy, etc.):**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for DNS propagation** (up to 48 hours)

4. **SSL Certificate** (auto-issued by Vercel)

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Gemini API**: https://ai.google.dev/docs
- **Project Issues**: https://github.com/yourusername/cramitup/issues

## ✅ Deployment Checklist

Before clicking "Deploy":

- [ ] Code pushed to GitHub
- [ ] `GEMINI_API_KEY` added in Vercel
- [ ] Tested locally with `vercel dev`
- [ ] `.env` file NOT committed
- [ ] All dependencies in `package.json` files
- [ ] Build command tested locally
- [ ] API endpoint tested

After deployment:

- [ ] Site loads correctly
- [ ] API generates mnemonics
- [ ] Dark mode works
- [ ] All languages work
- [ ] Mobile responsive
- [ ] SEO meta tags present

---

## 🎉 You're Done!

Your CramItUp app should now be live on Vercel!

**What's deployed:**
- ✅ React frontend with Vite
- ✅ Gemini AI integration
- ✅ 15 languages support
- ✅ Dark mode
- ✅ Fully responsive
- ✅ SEO optimized

**Next steps:**
- Share your app!
- Monitor usage
- Add custom domain
- Enable analytics
- Collect user feedback
