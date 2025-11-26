// vite-server.js
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting Vite server...');

const vite = spawn('npx', ['vite', '--host', '127.0.0.1', '--port', '5173'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, FORCE_COLOR: '1' }
});

vite.on('error', (error) => {
  console.error('Failed to start Vite:', error);
  process.exit(1);
});

vite.on('exit', (code) => {
  console.log(`Vite process exited with code ${code}`);
  if (code !== 0) {
    console.log('Restarting in 3 seconds...');
    setTimeout(() => {
      process.exit(code);
    }, 3000);
  }
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('\nShutting down Vite server...');
  vite.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  vite.kill('SIGTERM');
  process.exit(0);
});
