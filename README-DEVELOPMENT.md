# E-Bike Platform - Development Workflow

## 🚀 Quick Start

### Option 1: Clean Start (Recommended)
```powershell
# Navigate to project directory
cd C:\project\ebike-platform

# Clean start with process cleanup
.\start-dev.ps1 -Clean
```

### Option 2: Normal Start
```powershell
# Navigate to project directory
cd C:\project\ebike-platform

# Start development environment
.\start-dev.ps1
```

### Option 3: Using NPM Scripts
```powershell
# Clean restart (kills processes, restarts everything)
npm run full-restart

# Normal development
npm run dev

# Clean start
npm run dev:clean
```

## 🛑 Stopping Development

```powershell
# Stop all services cleanly
.\stop-dev.ps1

# Or use npm
npm run supabase:stop
```

## 🏥 Health Check

```powershell
# Check status of all services
.\health-check.ps1
```

## 📋 Available Scripts

### NPM Scripts
- `npm run dev` - Start Vite dev server
- `npm run dev:clean` - Clean processes and start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run clean` - Kill all node processes
- `npm run supabase:start` - Start Supabase only
- `npm run supabase:stop` - Stop Supabase only
- `npm run supabase:status` - Check Supabase status
- `npm run supabase:reset` - Reset Supabase database
- `npm run full-restart` - Complete restart (clean + start)

### PowerShell Scripts
- `.\start-dev.ps1` - Start development environment
- `.\start-dev.ps1 -Clean` - Clean start with process cleanup
- `.\stop-dev.ps1` - Stop all services
- `.\health-check.ps1` - Check service health

## 🔧 Configuration

### Port Configuration
- **Vite Dev Server**: 5173
- **Supabase API**: 54321
- **Supabase Database**: 54322
- **Supabase Studio**: 54323
- **Supabase Inbucket**: 54324
- **Edge Runtime**: 54325

### Vite Configuration
- Host: 127.0.0.1
- Strict Port: Enabled (fails if port in use)
- Auto-open: Disabled
- CORS: Enabled
- HMR Overlay: Enabled

### Supabase Configuration
- Database Version: 17
- Pooler: Disabled
- Edge Runtime: Enabled
- Unique ports for all services

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```powershell
# Check what's using the port
netstat -ano | findstr :5173

# Kill process by PID
taskkill /F /PID <PID>

# Or use the clean start
.\start-dev.ps1 -Clean
```

#### Supabase Won't Start
```powershell
# Stop and clean
npx supabase stop --no-backup

# Wait and restart
Start-Sleep -Seconds 3
npx supabase start
```

#### Node Processes Stuck
```powershell
# Kill all node processes
taskkill /F /IM node.exe

# Or use npm script
npm run clean
```

#### Database Issues
```powershell
# Reset database
npm run supabase:reset

# Check database status
npx supabase status
```

### Error States

#### AI Chatbot Not Loading
- Check browser console for errors
- Verify Supabase connection
- Try refreshing the page
- Check if all services are running

#### Vite Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`
- Verify all imports are correct

## 📁 Project Structure

```
ebike-platform/
├── src/
│   ├── components/          # Vue components
│   ├── stores/             # Pinia stores
│   ├── services/           # API services
│   ├── types/              # TypeScript types
│   └── views/              # Page components
├── supabase/
│   ├── config.toml         # Supabase configuration
│   └── migrations/         # Database migrations
├── start-dev.ps1           # Development startup script
├── stop-dev.ps1            # Development stop script
├── health-check.ps1        # Health check script
└── package.json            # Dependencies and scripts
```

## 🔄 Daily Workflow

### Morning Setup
1. Open PowerShell as Administrator
2. Navigate to project: `cd C:\project\ebike-platform`
3. Check health: `.\health-check.ps1`
4. Start development: `.\start-dev.ps1 -Clean`

### During Development
- Use `.\health-check.ps1` to monitor services
- Check browser console for errors
- Use Vue DevTools for debugging

### End of Day
1. Stop services: `.\stop-dev.ps1`
2. Commit changes: `git add . && git commit -m "Description"`
3. Push changes: `git push`

### When Things Break
1. Full restart: `npm run full-restart`
2. If still broken: `.\start-dev.ps1 -Clean`
3. Check logs: `.\health-check.ps1`
4. Reset database if needed: `npm run supabase:reset`

## 🚨 Emergency Procedures

### Complete Reset
```powershell
# Stop everything
.\stop-dev.ps1

# Kill all processes
taskkill /F /IM node.exe
taskkill /F /IM supabase.exe

# Wait
Start-Sleep -Seconds 5

# Clean start
.\start-dev.ps1 -Clean
```

### Database Reset
```powershell
# Stop Supabase
npx supabase stop

# Reset database
npx supabase db reset

# Start again
npx supabase start
```

## 📞 Support

If you encounter issues:
1. Check this README first
2. Run health check: `.\health-check.ps1`
3. Check browser console for errors
4. Try clean restart: `.\start-dev.ps1 -Clean`
5. Contact development team with error details

## 🔗 Useful Links

- [Vite Documentation](https://vitejs.dev/)
- [Vue.js Documentation](https://vuejs.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
