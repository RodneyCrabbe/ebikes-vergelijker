# E-Bike Platform Startup Script
# This script ensures all services start properly and handles common issues

Write-Host "🚀 Starting E-Bike Platform..." -ForegroundColor Green
Write-Host ""

# Function to check if Docker is running
function Test-DockerRunning {
    try {
        $null = docker ps 2>$null
        return $true
    } catch {
        return $false
    }
}

# Function to start Docker Desktop
function Start-DockerDesktop {
    Write-Host "🐳 Starting Docker Desktop..." -ForegroundColor Yellow
    try {
        Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe" -WindowStyle Hidden
        Write-Host "✓ Docker Desktop starting..." -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to start Docker Desktop. Please start it manually." -ForegroundColor Red
        Write-Host "Download from: https://docs.docker.com/desktop" -ForegroundColor Yellow
        return $false
    }
    return $true
}

# Function to wait for Docker to be ready
function Wait-ForDocker {
    $maxAttempts = 30
    $attempt = 0
    
    Write-Host "⏳ Waiting for Docker to be ready..." -ForegroundColor Yellow
    while ($attempt -lt $maxAttempts) {
        if (Test-DockerRunning) {
            Write-Host "✓ Docker is ready!" -ForegroundColor Green
            return $true
        }
        Start-Sleep -Seconds 2
        $attempt++
        Write-Host "." -NoNewline -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "❌ Docker failed to start within 60 seconds" -ForegroundColor Red
    return $false
}

# Step 1: Check and start Docker if needed
Write-Host "[1/5] Checking Docker..." -ForegroundColor Yellow
if (-not (Test-DockerRunning)) {
    if (-not (Start-DockerDesktop)) {
        Read-Host "Press Enter to exit"
        exit 1
    }
    if (-not (Wait-ForDocker)) {
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "✓ Docker is already running" -ForegroundColor Green
}
Write-Host ""

# Step 2: Start Supabase
Write-Host "[2/5] Starting Supabase..." -ForegroundColor Yellow
try {
    npx supabase start
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to start Supabase"
    }
    Write-Host "✓ Supabase started successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Failed to start Supabase" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 3: Reset and seed database
Write-Host "[3/5] Resetting and seeding database..." -ForegroundColor Yellow
try {
    npx supabase db reset
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to reset database"
    }
    Write-Host "✓ Database reset and seeded successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Failed to reset database" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 4: Start frontend
Write-Host "[4/5] Starting frontend development server..." -ForegroundColor Yellow
try {
    Start-Process cmd -ArgumentList "/k", "npm run dev" -WindowStyle Normal
    Write-Host "✓ Frontend server starting..." -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Failed to start frontend server" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
Write-Host ""

# Step 5: Show status and access points
Write-Host "[5/5] Platform Status:" -ForegroundColor Yellow
npx supabase status
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 E-Bike Platform is now running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Access Points:" -ForegroundColor White
Write-Host "- Main App: http://localhost:5173" -ForegroundColor White
Write-Host "- Database Studio: http://127.0.0.1:54323" -ForegroundColor White
Write-Host "- API: http://127.0.0.1:54321" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "- If e-bikes don't load, check the browser console for errors" -ForegroundColor Yellow
Write-Host "- Use the AI chatbot (blue icon) for e-bike recommendations" -ForegroundColor Yellow
Write-Host "- Compare e-bikes by selecting multiple models" -ForegroundColor Yellow
Write-Host ""

Write-Host "Press any key to stop all services..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "🛑 Stopping services..." -ForegroundColor Yellow
npx supabase stop
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "✓ All services stopped." -ForegroundColor Green
Read-Host "Press Enter to exit"
