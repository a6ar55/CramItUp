import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import rateLimit from 'express-rate-limit';
import {
  sanitizeInput,
  validateTopic,
  validateLanguage,
  validateOutput,
  rateLimitConfig,
  logSecurityEvent,
  buildSecurePrompt
} from './security.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Validate environment variables
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in environment variables!');
  process.exit(1);
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://cramitup.com', 'https://www.cramitup.com']
    : '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser with size limits
app.use(express.json({ limit: '10kb' }));

// Rate limiting to prevent abuse
const standardLimiter = rateLimit(rateLimitConfig.standard);
const feedbackLimiter = rateLimit(rateLimitConfig.feedback);

app.use('/api/generate', standardLimiter);
app.use('/api/feedback', feedbackLimiter);

// Request logging middleware for security monitoring
app.use('/api/', (req, res, next) => {
  console.log(`📊 ${req.method} ${req.path}`, {
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  next();
});

// API endpoint for generating mnemonics
app.post('/api/generate', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { topic, language = 'English' } = req.body;

    // Validate topic
    const topicValidation = validateTopic(topic);
    if (!topicValidation.isValid) {
      logSecurityEvent('invalid_topic', {
        topic,
        error: topicValidation.error,
        ip: req.ip
      });
      return res.status(400).json({ error: topicValidation.error });
    }

    // Validate language
    const languageValidation = validateLanguage(language);
    if (!languageValidation.isValid) {
      return res.status(400).json({ error: languageValidation.error });
    }

    // Sanitize input
    const sanitizedTopic = sanitizeInput(topic);

    console.log('\n📝 Generating mnemonic for:', sanitizedTopic);
    console.log('🌍 Language:', language);

    // Build secure prompt
    const prompt = buildSecurePrompt(sanitizedTopic, language);

    // Call Gemini API with safety settings
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    // Validate output for security
    if (!validateOutput(generatedText)) {
      logSecurityEvent('invalid_output', {
        topic: sanitizedTopic,
        outputLength: generatedText.length
      });
      throw new Error('Output validation failed');
    }

    console.log('\n🤖 Raw API Response:');
    console.log(generatedText.substring(0, 200) + '...');

    // Try to parse JSON from the response
    let mnemonicData;
    try {
      // Remove markdown code blocks if present
      let jsonText = generatedText.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      mnemonicData = JSON.parse(jsonText);
      console.log('✅ Successfully parsed JSON');
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError.message);
      console.log('Attempting to extract JSON...');

      // Try to find JSON in the text
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          mnemonicData = JSON.parse(jsonMatch[0]);
          console.log('✅ Extracted and parsed JSON');
        } catch (e) {
          console.error('❌ Could not extract valid JSON');
          throw new Error('Failed to parse mnemonic data');
        }
      } else {
        throw new Error('No JSON found in response');
      }
    }

    const duration = Date.now() - startTime;
    console.log(`⏱️ Request completed in ${duration}ms`);

    res.json({
      success: true,
      data: mnemonicData,
      topic: sanitizedTopic,
      language
    });

  } catch (error) {
    console.error('Error generating mnemonic:', error);

    // Log security-relevant errors
    logSecurityEvent('generation_error', {
      error: error.message,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });

    // Handle API errors gracefully
    if (error.message?.includes('API key')) {
      return res.status(500).json({
        error: 'Oops! API configuration issue. Please check the setup. 🔧'
      });
    }

    if (error.message?.includes('safety')) {
      return res.status(400).json({
        error: 'Content blocked by safety filters. Please try a different topic. 🛡️'
      });
    }

    res.status(500).json({
      error: 'Try again—Gemini is taking a nap! 😴'
    });
  }
});

// Feedback endpoint
app.post('/api/feedback', async (req, res) => {
  try {
    const { rating, topic } = req.body;

    // Validate feedback
    if (!rating || !['up', 'down'].includes(rating)) {
      return res.status(400).json({ error: 'Invalid rating' });
    }

    if (topic && typeof topic === 'string') {
      const sanitizedTopic = sanitizeInput(topic);
      console.log('Feedback received:', { 
        rating, 
        topic: sanitizedTopic, 
        timestamp: new Date().toISOString(),
        ip: req.ip
      });
    } else {
      console.log('Feedback received:', { 
        rating, 
        timestamp: new Date().toISOString(),
        ip: req.ip
      });
    }

    // In a real app, store this in a database
    res.json({ success: true, message: 'Thanks for your feedback! 🙏' });
  } catch (error) {
    console.error('Error recording feedback:', error);
    res.status(500).json({ error: 'Failed to record feedback' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 CramItUp backend running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/generate`);
});
