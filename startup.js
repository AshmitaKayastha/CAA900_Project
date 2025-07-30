const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting e-learning application...');

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
// Azure App Service provides PORT environment variable
process.env.PORT = process.env.PORT || 8080;

// Start the server
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: process.env,
  cwd: __dirname
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`📴 Server exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});