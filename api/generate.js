import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Input sanitization
function sanitizeInput(text) {
  return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim()
    .substring(0, 500);
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

IMPORTANT:
1. Make the PRIMARY mnemonic FUNNY, DARK, or WEIRD to be unforgettable
2. Use emojis liberally to make it visual
3. The weirder and more unconventional, the better - students remember bizarre things!
4. Include dark humor if appropriate (nothing offensive, just quirky)
5. Breakdown should match the letters/words in the mnemonic
6. Provide 2 alternative mnemonics with different styles
7. Keep it appropriate for students but push creative boundaries
8. Respond ONLY with the JSON object, no additional text

Examples of the style we want:

Example 1 (Planets from Sun):
{
  "primary": {
    "mnemonic": "My Very Evil Mother Just Served Us Nachos 🌮👹",
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
    "explanation": "The image of an evil mother serving nachos is so absurd and dark-humored that it sticks in your mind forever! 😈"
  },
  "alternatives": [
    {"mnemonic": "My Vampire Eats Many Juicy Steaks, Ugh! Nasty! 🧛‍♂️🥩"},
    {"mnemonic": "Most Vicious Eagles Make Jumps Successfully, Unlike Newbies 🦅"}
  ]
}

Example 2 (Tamil - Continents):
{
  "primary": {
    "mnemonic": "அம்மா அழுது நாள் எல்லாம் ஆசை அழகு 😭💔",
    "breakdown": [
      {"letter": "அ", "represents": "ஆசியா (Asia)"},
      {"letter": "ஆ", "represents": "ஆப்பிரிக்கா (Africa)"},
      {"letter": "ந", "represents": "வடஅமெரிக்கா (North America)"},
      {"letter": "தெ", "represents": "தெற்கு அமெரிக்கா (South America)"},
      {"letter": "ஐ", "represents": "ஐரோப்பா (Europe)"},
      {"letter": "அ", "represents": "அண்டார்டிகா (Antarctica)"},
      {"letter": "ஆ", "represents": "ஆஸ்திரேலியா (Australia)"}
    ],
    "explanation": "தாயின் கண்ணீரை நினைத்தால் உலகின் அனைத்து கண்டங்களும் நினைவில் வரும்! உணர்ச்சி மிகுந்த கதை!"
  },
  "alternatives": [
    {"mnemonic": "அன்பு ஆனந்தம் நல்ல தேநீர் ஏழை அழகு ஆடை 🍵✨"},
    {"mnemonic": "அரசன் ஆவேசம் நகரம் தெரு ஐயோ அச்சம் ஆபத்து 👑⚔️"}
  ]
}

Now generate for the given topic in ${language}.`;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
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
    const { topic, language } = req.body;

    if (!topic || !language) {
      return res.status(400).json({
        error: 'Missing required fields: topic and language'
      });
    }

    const sanitizedTopic = sanitizeInput(topic);

    console.log('\n📝 Generating mnemonic for:', sanitizedTopic);
    console.log('🌍 Language:', language);

    const prompt = buildPrompt(sanitizedTopic, language);

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
      console.error('Failed text:', generatedText);

      return res.status(500).json({
        error: 'Failed to parse AI response',
        details: parseError.message
      });
    }

    res.status(200).json({
      success: true,
      data: mnemonicData,
      topic: sanitizedTopic,
      language
    });

  } catch (error) {
    console.error('Error generating mnemonic:', error);
    res.status(500).json({
      error: 'Failed to generate mnemonic',
      message: error.message
    });
  }
}
