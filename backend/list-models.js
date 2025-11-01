import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Error:', data);
      return;
    }

    console.log('Available models:');
    console.log(JSON.stringify(data, null, 2));

    // Extract and display just model names
    if (data.models) {
      console.log('\nModel names:');
      data.models.forEach(model => {
        console.log(`- ${model.name}`);
        if (model.supportedGenerationMethods) {
          console.log(`  Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
