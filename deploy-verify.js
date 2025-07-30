const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying deployment package structure...');

const requiredFiles = [
  'server.js',
  'startup.js',
  'package.json',
  'web.config',
  'build/index.html',
  'node_modules/express/package.json'
];

const requiredDirs = [
  'config',
  'models',
  'routes',
  'build',
  'node_modules'
];

console.log('\n📁 Checking required files:');
let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('\n📂 Checking required directories:');
let allDirsExist = true;
requiredDirs.forEach(dir => {
  const exists = fs.existsSync(dir) && fs.statSync(dir).isDirectory();
  console.log(`${exists ? '✅' : '❌'} ${dir}/`);
  if (!exists) allDirsExist = false;
});

console.log('\n📦 Checking package.json:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`✅ Package name: ${packageJson.name}`);
  console.log(`✅ Main entry: ${packageJson.main}`);
  console.log(`✅ Start script: ${packageJson.scripts.start}`);
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

console.log('\n🌐 Checking web.config:');
try {
  const webConfig = fs.readFileSync('web.config', 'utf8');
  if (webConfig.includes('startup.js')) {
    console.log('✅ web.config points to startup.js');
  } else {
    console.log('❌ web.config should point to startup.js');
  }
} catch (error) {
  console.log('❌ Error reading web.config:', error.message);
}

console.log('\n📊 Summary:');
if (allFilesExist && allDirsExist) {
  console.log('✅ All required files and directories exist');
  console.log('🚀 Package should be ready for deployment');
} else {
  console.log('❌ Some required files or directories are missing');
  console.log('⚠️  Please check the missing items above');
}

// Check file sizes
console.log('\n📏 Package size analysis:');
const getDirSize = (dir) => {
  let size = 0;
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        size += getDirSize(filePath);
      } else {
        size += stat.size;
      }
    });
  }
  return size;
};

const buildSize = getDirSize('build');
const nodeModulesSize = getDirSize('node_modules');
const totalSize = buildSize + nodeModulesSize;

console.log(`📁 build/ directory: ${(buildSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`📦 node_modules/ directory: ${(nodeModulesSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`📊 Total estimated size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

if (totalSize > 500 * 1024 * 1024) { // 500MB limit
  console.log('⚠️  Package size is large, consider optimizing');
}