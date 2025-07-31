const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing hardcoded URLs in build files...');

const buildDir = path.join(__dirname, '../client/build');
const productionUrl = 'https://elearners-g3gshfgvbhetg0fp.canadacentral-01.azurewebsites.net';

// Function to recursively process files
function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`❌ Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.js.map') || file.endsWith('.html')) {
      processFile(filePath);
    }
  });
}

// Function to process individual files
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace localhost URLs with production URLs
    const replacements = [
      {
        from: /http:\/\/localhost:5001\/api/g,
        to: `${productionUrl}/api`
      },
      {
        from: /http:\/\/localhost:5001/g,
        to: productionUrl
      }
    ];
    
    replacements.forEach(replacement => {
      if (replacement.from.test(content)) {
        content = content.replace(replacement.from, replacement.to);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Start processing
console.log(`🎯 Replacing localhost:5001 with ${productionUrl}`);
processDirectory(buildDir);
console.log('✅ URL replacement complete!');