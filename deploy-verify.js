const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying deployment package...');

const requiredFiles = [
  'server.js',
  'startup.js',
  'package.json',
  'web.config',
  'config/keys.js',
  'build/index.html'
];

const requiredDirs = [
  'models',
  'routes',
  'validation',
  'uploads',
  'build'
];

let allGood = true;

// Check required files
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allGood = false;
  }
}

// Check required directories
for (const dir of requiredDirs) {
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    console.log(`✅ ${dir}/ directory exists`);
  } else {
    console.log(`❌ ${dir}/ directory missing`);
    allGood = false;
  }
}

// Check node_modules
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules exists');
} else {
  console.log('❌ node_modules missing');
  allGood = false;
}

// Check package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.scripts && packageJson.scripts.start) {
    console.log('✅ package.json has start script');
  } else {
    console.log('❌ package.json missing start script');
    allGood = false;
  }
} catch (error) {
  console.log('❌ Invalid package.json');
  allGood = false;
}

if (allGood) {
  console.log('🎉 Deployment package verification passed!');
  process.exit(0);
} else {
  console.log('💥 Deployment package verification failed!');
  process.exit(1);
}