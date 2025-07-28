#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎯 Real Google Analytics Setup - Spotify Clone');
console.log('==============================================\n');

const questions = [
  {
    name: 'measurementId',
    question: '📊 Enter your Google Analytics Measurement ID (G-XXXXXXXXXX): ',
    validate: (value) => value.startsWith('G-') && value.length === 12
  },
  {
    name: 'propertyId',
    question: '🏢 Enter your Google Analytics Property ID (10 digits): ',
    validate: (value) => /^\d{10}$/.test(value)
  },
  {
    name: 'clientEmail',
    question: '📧 Enter your Service Account Client Email: ',
    validate: (value) => value.includes('@') && value.includes('.iam.gserviceaccount.com')
  },
  {
    name: 'privateKey',
    question: '🔑 Enter your Service Account Private Key (full key with newlines): ',
    validate: (value) => value.includes('-----BEGIN PRIVATE KEY-----') && value.includes('-----END PRIVATE KEY-----')
  }
];

let answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    generateEnvFile();
    return;
  }

  const question = questions[index];
  
  rl.question(question.question, (answer) => {
    if (question.validate(answer)) {
      answers[question.name] = answer;
      askQuestion(index + 1);
    } else {
      console.log('❌ Invalid input. Please try again.\n');
      askQuestion(index);
    }
  });
}

function generateEnvFile() {
  console.log('\n📝 Generating .env.local file with real Google Analytics credentials...\n');
  
  const envContent = `# Google Analytics - REAL DATA
NEXT_PUBLIC_GA_MEASUREMENT_ID=${answers.measurementId}
GA_PROPERTY_ID=${answers.propertyId}
GA_PRIVATE_KEY="${answers.privateKey}"
GA_CLIENT_EMAIL=${answers.clientEmail}

# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Admin Analytics (Optional)
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
`;

  try {
    fs.writeFileSync('.env.local', envContent);
    console.log('✅ .env.local file created successfully!\n');
    
    console.log('📋 Next Steps:');
    console.log('1. Install Google Analytics package: npm install @google-analytics/data');
    console.log('2. Start development server: npm run dev');
    console.log('3. Test analytics endpoint: http://localhost:3000/api/analytics');
    console.log('4. Check dashboard for "Real Data" indicator');
    console.log('5. Deploy to production with these environment variables\n');
    
    console.log('🔒 Security Reminder:');
    console.log('- Never commit .env.local to git');
    console.log('- Add .env.local to .gitignore');
    console.log('- Set environment variables in your hosting platform\n');
    
    console.log('🎉 Real Google Analytics setup complete!');
    console.log('Your dashboard will now show real data instead of simulated data.');
    
  } catch (error) {
    console.error('❌ Error creating .env.local file:', error.message);
  }
  
  rl.close();
}

// Start the wizard
console.log('This wizard will help you set up REAL Google Analytics data.');
console.log('Make sure you have:');
console.log('✅ Google Analytics account created');
console.log('✅ Google Cloud project with service account');
console.log('✅ Downloaded JSON credentials file\n');

rl.question('Press Enter to continue...', () => {
  askQuestion(0);
}); 