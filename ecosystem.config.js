/**
 * PM2 Ecosystem Configuration
 * Keeps servers running persistently with auto-restart
 *
 * Install PM2: npm install -g pm2
 * Start: pm2 start ecosystem.config.js
 * Stop: pm2 stop all
 * Restart: pm2 restart all
 * Monitor: pm2 monit
 * Logs: pm2 logs
 */

module.exports = {
  apps: [
    {
      name: 'ebike-vite',
      script: 'npm',
      args: 'run dev',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
      },
      error_file: './logs/vite-error.log',
      out_file: './logs/vite-out.log',
      log_file: './logs/vite-combined.log',
      time: true,
      merge_logs: true,
    }
  ]
}
