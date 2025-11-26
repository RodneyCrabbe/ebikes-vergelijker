@echo off
echo ========================================
echo    E-BIKE PLATFORM - STOP SCRIPT
echo ========================================
echo.

echo [1/2] Stopping Development Server...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✅ Development server stopped
) else (
    echo ℹ️  No development server running
)

echo.
echo [2/2] Stopping Supabase...
call npx supabase stop
if %errorlevel% equ 0 (
    echo ✅ Supabase stopped
) else (
    echo ℹ️  Supabase was not running
)

echo.
echo ========================================
echo    ALL SERVICES STOPPED!
echo ========================================
pause