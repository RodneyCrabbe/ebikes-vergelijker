# start-dev.ps1
param([switch]$Clean)

Write-Host "Starting E-Bike Platform..." -ForegroundColor Cyan

if ($Clean) {
    Write-Host "Cleaning up..." -ForegroundColor Yellow
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
    npx supabase stop --no-backup 2>&1 | Out-Null
    Start-Sleep -Seconds 3
}

# Start Supabase
Write-Host "Starting Supabase..." -ForegroundColor Green
npx supabase start
if ($LASTEXITCODE -ne 0) {
    Write-Host "Supabase failed, retrying..." -ForegroundColor Red
    docker stop $(docker ps -aq) 2>&1 | Out-Null
    Start-Sleep -Seconds 3
    npx supabase start
}

Start-Sleep -Seconds 5

# Start Vite with Task Scheduler
Write-Host "Starting Vite server..." -ForegroundColor Green
Start-ScheduledTask -TaskName "EBikePlatform-Dev"

Start-Sleep -Seconds 10

# Verify
Write-Host "`nChecking status..." -ForegroundColor Yellow
$task = Get-ScheduledTask -TaskName "EBikePlatform-Dev"
$taskInfo = Get-ScheduledTaskInfo -TaskName "EBikePlatform-Dev"

if ($task.State -eq "Running") {
    Write-Host "SUCCESS! Services are running:" -ForegroundColor Green
    Write-Host "  Frontend:  http://127.0.0.1:5173" -ForegroundColor Cyan
    Write-Host "  Supabase:  http://127.0.0.1:54321" -ForegroundColor Cyan
    Write-Host "  Studio:    http://127.0.0.1:54323" -ForegroundColor Cyan
} else {
    Write-Host "WARNING: Task state is $($task.State)" -ForegroundColor Yellow
    Write-Host "Last run: $($taskInfo.LastRunTime)" -ForegroundColor Yellow
    Write-Host "Last result: $($taskInfo.LastTaskResult)" -ForegroundColor Yellow
}