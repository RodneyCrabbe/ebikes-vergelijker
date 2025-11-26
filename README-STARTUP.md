# 🚀 E-Bike Vergelijker - Startup Guide

## Quick Start (Recommended)

### Option 1: Using npm (Easiest)
```bash
npm run dev
```
This will automatically start both Supabase and the frontend development server.

### Option 2: Using Batch Script (Windows)
```bash
start-app.bat
```

### Option 3: Using PowerShell Script (Windows)
```powershell
.\start-app.ps1
```

## Manual Start (If needed)

### 1. Start Supabase
```bash
npm run supabase:start
# or
npx supabase start
```

### 2. Start Frontend
```bash
npm run dev:frontend
# or
npx vite
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | **Main command** - Starts both Supabase and frontend |
| `npm run dev:frontend` | Start only the frontend (Vite) |
| `npm run dev:supabase` | Start only Supabase |
| `npm run supabase:start` | Start Supabase |
| `npm run supabase:stop` | Stop Supabase |
| `npm run supabase:status` | Check Supabase status |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Access Points

Once started, you can access:

- **Main App**: http://localhost:5173
- **Database Studio**: http://127.0.0.1:54323
- **Mail Interface**: http://127.0.0.1:54324
- **API**: http://127.0.0.1:54321

## Troubleshooting

### If Supabase fails to start:
```bash
npx supabase stop
npx supabase start
```

### If frontend fails to start:
```bash
npm install
npm run dev:frontend
```

### Check if services are running:
```bash
npm run supabase:status
```

## Requirements

- Node.js 18+ 
- npm or yarn
- Supabase CLI (installed globally or via npx)

## Notes

- The app requires both Supabase and the frontend to be running
- Use `Ctrl+C` to stop the development server
- The database persists between restarts
- All authentication and data is stored locally in Supabase
