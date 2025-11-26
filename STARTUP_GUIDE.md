# E-Bike Platform - Startup Guide

## 🚀 Quick Start (Recommended)

### Option 1: Using Batch Script (Windows - Easiest)

Simply double-click **`start-dev.bat`** in the project root folder.

This will:
- ✅ Check if Supabase is running and start it if needed
- ✅ Start the Vite dev server on port 5173
- ✅ Open the application in your browser
- ✅ Keep both servers running

**Important:** Keep all terminal windows open while developing!

To stop all servers, double-click **`stop-dev.bat`**

---

### Option 2: Manual Start (More Control)

#### Step 1: Start Supabase

Open a terminal and run:

```bash
cd C:\project\ebike-platform
npx supabase start
```

**Keep this terminal window open!**

Supabase will be available at:
- **API:** http://127.0.0.1:54321
- **Studio:** http://127.0.0.1:54323

#### Step 2: Start Vite Dev Server

Open a **NEW** terminal and run:

```bash
cd C:\project\ebike-platform
npm run dev
```

**Keep this terminal window open too!**

The application will be available at:
- **App:** http://127.0.0.1:5173

---

### Option 3: PM2 (Persistent Servers - Advanced)

For servers that auto-restart and persist across reboots:

#### Install PM2 (one-time setup)

```bash
npm install -g pm2
```

#### Start Servers

```bash
cd C:\project\ebike-platform
npm run dev:persistent
```

#### Manage PM2 Servers

```bash
# Monitor servers in real-time
npm run dev:monitor

# View logs
npm run dev:logs

# Restart servers
npm run dev:restart

# Stop all servers
npm run dev:stop

# List running processes
pm2 list
```

#### PM2 Auto-Startup (Optional)

To make servers start automatically when your computer starts:

```bash
pm2 startup
pm2 save
```

---

## 📊 Verify Everything is Running

### Check Supabase

```bash
npm run supabase:status
```

Expected output should show:
```
API URL: http://127.0.0.1:54321
...
supabase local development setup is running.
```

### Check Dev Server

Open your browser to http://127.0.0.1:5173

You should see the E-Bike Platform homepage with:
- ✅ E-bikes displayed
- ✅ Login button works
- ✅ Afspraak button works
- ✅ All navigation functional

### Check Database

```bash
curl http://127.0.0.1:54321/rest/v1/ebikes?select=id,brand,model_name&limit=3 \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
```

You should see JSON data with e-bikes.

---

## 🔧 Troubleshooting

### Problem: E-bikes Not Showing

**Solution 1:** Check if Supabase is running

```bash
npm run supabase:status
```

If not running:

```bash
npm run supabase:start
```

**Solution 2:** Check if database has data

```bash
curl http://127.0.0.1:54321/rest/v1/ebikes?select=count \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
```

If empty, reset the database:

```bash
npm run supabase:reset
```

### Problem: Cannot Login

**Solution:** Reset Supabase auth

```bash
npm run supabase:stop
npm run supabase:start
```

### Problem: Port 5173 Already in Use

**Solution:** Kill the process and restart

Windows:
```bash
npm run clean
npm run dev
```

Or manually:
```bash
netstat -ano | findstr :5173
taskkill /F /PID [PID_NUMBER]
npm run dev
```

### Problem: Servers Keep Stopping

**Solution:** Use PM2 for persistent servers

```bash
npm install -g pm2
npm run dev:persistent
```

This keeps servers running even if they crash and auto-restarts them.

### Problem: Dev Server Shows Wrong Port

**Solution:** Force port 5173

Edit `vite.config.ts` and ensure:

```typescript
server: {
  host: '127.0.0.1',
  port: 5173,
  strictPort: true, // Force this port or fail
}
```

Then restart:

```bash
npm run dev:clean
```

---

## 🎯 Available Scripts

### Development

- `npm run dev` - Start dev server (checks environment first)
- `npm run dev:frontend` - Start only Vite dev server
- `npm run dev:supabase` - Start only Supabase
- `npm run dev:clean` - Clean and restart dev server
- `npm run dev:persistent` - Start with PM2 (auto-restart)
- `npm run dev:stop` - Stop PM2 servers
- `npm run dev:restart` - Restart PM2 servers
- `npm run dev:monitor` - Monitor PM2 servers
- `npm run dev:logs` - View PM2 logs

### Supabase

- `npm run supabase:start` - Start Supabase
- `npm run supabase:stop` - Stop Supabase
- `npm run supabase:status` - Check Supabase status
- `npm run supabase:reset` - Reset database (⚠️ deletes all data)

### Build

- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Testing

- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run E2E tests

---

## 📱 Access URLs

Once servers are running:

| Service | URL |
|---------|-----|
| **Application** | http://127.0.0.1:5173 |
| **Supabase API** | http://127.0.0.1:54321 |
| **Supabase Studio** | http://127.0.0.1:54323 |
| **Mailpit (Email Testing)** | http://127.0.0.1:54324 |

---

## ⚠️ Important Notes

1. **Keep Terminal Windows Open**: Don't close the terminal windows running the servers
2. **Port 5173**: Always access the app at port 5173, not 5174
3. **Supabase First**: Always start Supabase before the dev server
4. **Environment Variables**: Make sure `.env` file exists with correct values
5. **Node Version**: Use Node.js v18 or higher

---

## 🔄 Daily Workflow

### Starting Your Day

1. Open terminal
2. Run `start-dev.bat` (or `npm run dev:persistent`)
3. Wait for servers to start
4. Open http://127.0.0.1:5173
5. Start coding!

### During Development

- Vite automatically reloads when you save files
- Supabase stays running in the background
- Check browser console for errors
- Use Supabase Studio (http://127.0.0.1:54323) to view database

### Ending Your Day

- **Option 1:** Leave servers running (uses ~500MB RAM)
- **Option 2:** Run `stop-dev.bat` to stop all servers
- **Option 3:** If using PM2, servers will auto-restart next time

---

## 🆘 Need Help?

### Check Server Status

```bash
# Check Supabase
npm run supabase:status

# Check if dev server is running
curl http://127.0.0.1:5173
```

### View Logs

```bash
# PM2 logs
npm run dev:logs

# Or check terminal windows where servers are running
```

### Full Restart

```bash
# Stop everything
npm run supabase:stop
npm run clean

# Wait 5 seconds

# Start everything fresh
npm run supabase:start
# Wait for Supabase to fully start
npm run dev
```

---

## 💡 Pro Tips

1. **Use PM2 for stability**: Once set up, servers auto-restart on crashes
2. **Bookmark URLs**: Save time by bookmarking all service URLs
3. **Use Supabase Studio**: Great for viewing/editing database data
4. **Check logs regularly**: Catch errors early by monitoring logs
5. **Keep backups**: Regularly backup your database with `npm run db:backup`

---

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Vue.js Documentation](https://vuejs.org/)

---

## ✅ Checklist

Before starting development each day:

- [ ] Supabase is running (`npm run supabase:status`)
- [ ] Dev server is on port 5173
- [ ] Can access http://127.0.0.1:5173
- [ ] E-bikes are visible on the homepage
- [ ] Login functionality works
- [ ] Afspraak page is accessible
- [ ] Browser console shows no errors

---

**Happy Coding! 🚴‍♂️💨**
