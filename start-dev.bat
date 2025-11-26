@echo off
echo ========================================
echo    E-BIKE PLATFORM - STARTUP SCRIPT
echo ========================================
echo.

echo [1/3] Starting Supabase...
call npx supabase start
if %errorlevel% neq 0 (
    echo ERROR: Failed to start Supabase
    pause
    exit /b 1
)

echo.
echo [2/3] Waiting for Supabase to be ready...
timeout /t 5 /nobreak >nul

echo.
echo [3/3] Starting Development Server...
call npm run dev
if %errorlevel% neq 0 (
    echo ERROR: Failed to start development server
    pause
    exit /b 1
)

echo.
echo ========================================
echo    ALL SERVICES STARTED SUCCESSFULLY!
echo ========================================
echo.
echo 🌐 App URL: http://127.0.0.1:5173
echo 🗄️  Supabase Studio: http://127.0.0.1:54323
echo.
echo Press Ctrl+C to stop all services
pause