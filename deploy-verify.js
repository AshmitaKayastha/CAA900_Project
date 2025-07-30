const fs = require('fs');
const path = require('path');

console.log('🔍 Deployment Verification Script');
console.log('================================');

// Check if required files exist
const requiredFiles = [
  'server.js',
  'package.json',
  'web.config',
  'startup.js',
  'build/index.html'
];

console.log('\n📁 Checking required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file} ${exists ? 'exists' : 'missing'}`);
});

// Check build directory
console.log('\n📦 Checking build directory:');
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  const buildFiles = fs.readdirSync(buildPath);
  console.log(`✅ build directory exists with ${buildFiles.length} files`);
  console.log('   Files:', buildFiles.slice(0, 5).join(', '), buildFiles.length > 5 ? '...' : '');
} else {
  console.log('❌ build directory missing');
}

// Check environment variables
console.log('\n🌍 Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('PORT:', process.env.PORT || 'not set');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'set (hidden)' : 'not set');

// Check package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('\n📋 Package.json info:');
  console.log('Name:', packageJson.name);
  console.log('Version:', packageJson.version);
  console.log('Main:', packageJson.main);
  console.log('Start script:', packageJson.scripts?.start || 'not found');
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

console.log('\n✅ Verification complete');