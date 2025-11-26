#!/bin/bash
# E-Bike Platform - Development Server Startup Script (Unix/Mac)
# This script ensures both Supabase and Vite dev server are running

echo "===================================="
echo "E-Bike Platform - Starting Servers"
echo "===================================="
echo ""

# Change to script directory
cd "$(dirname "$0")"

# Check if Supabase is running
echo "[1/3] Checking Supabase status..."
if ! npx supabase status &>/dev/null; then
    echo "Supabase is not running. Starting Supabase..."
    npx supabase start
    echo "Waiting for Supabase to be ready..."
    sleep 5
else
    echo "Supabase is already running!"
fi

echo ""
echo "[2/3] Starting Vite Dev Server..."
npm run dev &
DEV_SERVER_PID=$!

echo ""
echo "[3/3] Servers started!"
echo ""
echo "===================================="
echo "Servers are now running:"
echo "===================================="
echo " - Supabase:        http://127.0.0.1:54321"
echo " - Supabase Studio: http://127.0.0.1:54323"
echo " - Dev Server:      http://127.0.0.1:5173"
echo "===================================="
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for dev server
wait $DEV_SERVER_PID
