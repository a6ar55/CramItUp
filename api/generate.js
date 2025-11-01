import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  sanitizeInput,
  validateTopic,
  validateLanguage,
  validateOutput,
  logSecurityEvent,
  buildSecurePrompt
} from './security.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export default async function handler(req, res) {
  const startTime = Date.now();

  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, X-Requested-With'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, language = 'English' } = req.body;

    // Validate topic
    const topicValidation = validateTopic(topic);
    if (!topicValidation.isValid) {
      logSecurityEvent('invalid_topic', {
        topic,
        error: topicValidation.error,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
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
    // Using optimized config for faster responses
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 2048, // Reduced from 8192 for faster responses
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

    // Generate content with timeout protection
    const timeoutMs = 50000; // 50 seconds (leaving buffer before 60s limit)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout - AI response took too long')), timeoutMs);
    });

    let result, response, generatedText;
    try {
      result = await Promise.race([
        model.generateContent(prompt),
        timeoutPromise
      ]);
      response = await result.response;
      generatedText = response.text();
    } catch (timeoutError) {
      if (timeoutError.message.includes('timeout')) {
        return res.status(504).json({
          error: 'AI response took too long. Please try again with a simpler topic! ⏱️'
        });
      }
      throw timeoutError;
    }

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

    // Parse JSON response
    let mnemonicData;
    try {
      let jsonText = generatedText.trim();

      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      mnemonicData = JSON.parse(jsonText);

      // Validate structure
      if (!mnemonicData.primary || !mnemonicData.alternatives) {
        throw new Error('Invalid response structure');
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      
      // Try to extract JSON from the text
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          mnemonicData = JSON.parse(jsonMatch[0]);
        } catch (e) {
          return res.status(500).json({
            error: 'Failed to parse AI response',
            details: parseError.message
          });
        }
      } else {
        return res.status(500).json({
          error: 'Failed to parse AI response',
          details: parseError.message
        });
      }
    }

    const duration = Date.now() - startTime;
    console.log(`⏱️ Request completed in ${duration}ms`);

    res.status(200).json({
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
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
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

    if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
      return res.status(504).json({
        error: 'Request timed out. The AI is taking too long to respond. Please try again! ⏱️'
      });
    }

    res.status(500).json({
      error: 'Try again—Gemini is taking a nap! 😴',
      message: error.message
    });
  }
}
