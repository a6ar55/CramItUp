import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: 'Too many requests from this IP, please try again later! 😴'
});

app.use('/api/', limiter);

// Input sanitization
function sanitizeInput(text) {
  // Remove any potentially harmful characters
  return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim()
    .substring(0, 500); // Enforce max 500 chars
}

// Few-shot prompting strategy with JSON output
function buildPrompt(topic, language) {
  return `You are a creative mnemonic generator that helps students memorize topics using acronyms, shortcuts, and mnemonics. Your specialty is making mnemonics HIGHLY memorable by incorporating humor, funny elements, dark humor, and weird/unconventional twists.

Topic: ${topic}
Language: ${language}

Generate mnemonics and respond with ONLY valid JSON in this exact format:

{
  "primary": {
    "mnemonic": "The main mnemonic sentence with emojis",
    "breakdown": [
      {"letter": "First letter/word", "represents": "What it stands for"}
    ],
    "explanation": "Why this twist makes it memorable"
  },
  "alternatives": [
    {"mnemonic": "First alternative with emojis"},
    {"mnemonic": "Second alternative with emojis"}
  ]
}

Requirements:
1. Use the FIRST LETTERS or KEY WORDS from the topic to build acronyms
2. Add humor, dark humor, or weird/absurd elements to boost memorability
3. Include emojis for visual appeal (minimum 2 per mnemonic)
4. Make the twist shocking, funny, or absurd
5. Be culturally sensitive while maintaining creativity
6. Output in ${language} language
7. IMPORTANT: Return ONLY the JSON object, no other text

Example for "Planets from Sun":
{
  "primary": {
    "mnemonic": "My Very Evil Mother Just Served Us Nachos... but poisoned them! 💀🌮",
    "breakdown": [
      {"letter": "M", "represents": "Mercury"},
      {"letter": "V", "represents": "Venus"},
      {"letter": "E", "represents": "Earth"},
      {"letter": "M", "represents": "Mars"},
      {"letter": "J", "represents": "Jupiter"},
      {"letter": "S", "represents": "Saturn"},
      {"letter": "U", "represents": "Uranus"},
      {"letter": "N", "represents": "Neptune"}
    ],
    "explanation": "The dark twist of poisoned nachos adds shock value, making the acronym unforgettable. Your brain remembers weird + danger!"
  },
  "alternatives": [
    {"mnemonic": "Mad Vikings Eat Many Juicy Strawberries Under Nightfall 🍓🌙"},
    {"mnemonic": "My Vampire Eats Marshmallows Joyfully, Surprising Unwary Neighbors 🧛‍♂️"}
  ]
}

Now generate for: ${topic}`;
}

// API endpoint for generating mnemonics
app.post('/api/generate', async (req, res) => {
  try {
    const { topic, language = 'English' } = req.body;

    // Validate input
    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({
        error: 'Please enter a topic to memorize! 🤔'
      });
    }

    if (topic.length > 500) {
      return res.status(400).json({
        error: 'Topic is too long! Keep it under 500 characters. ✂️'
      });
    }

    const sanitizedTopic = sanitizeInput(topic);
    const prompt = buildPrompt(sanitizedTopic, language);

    console.log('\n📝 Generating mnemonic for:', sanitizedTopic);
    console.log('🌍 Language:', language);

    // Call Gemini API
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    console.log('\n🤖 Raw API Response:');
    console.log(generatedText);
    console.log('\n---\n');

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

    res.json({
      success: true,
      data: mnemonicData,
      topic: sanitizedTopic,
      language
    });

  } catch (error) {
    console.error('Error generating mnemonic:', error);

    // Handle API errors gracefully
    if (error.message?.includes('API key')) {
      return res.status(500).json({
        error: 'Oops! API configuration issue. Please check the setup. 🔧'
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

    // In a real app, you'd store this in a database
    // For now, just log it
    console.log('Feedback received:', { rating, topic, timestamp: new Date() });

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
