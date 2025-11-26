# health-check.ps1
Write-Host "E-Bike Platform Health Check" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Check Scheduled Task
Write-Host "`nVite Server Task:" -ForegroundColor Yellow
$task = Get-ScheduledTask -TaskName "EBikePlatform-Dev" -ErrorAction SilentlyContinue
if ($task) {
    $taskInfo = Get-ScheduledTaskInfo -TaskName "EBikePlatform-Dev"
    Write-Host "  State: $($task.State)" -ForegroundColor $(if($task.State -eq "Running"){"Green"}else{"Red"})
    Write-Host "  Last Run: $($taskInfo.LastRunTime)" -ForegroundColor Cyan
    Write-Host "  Last Result: $($taskInfo.LastTaskResult)" -ForegroundColor Cyan
} else {
    Write-Host "  Not installed" -ForegroundColor Red
}

# Check Supabase
Write-Host "`nSupabase:" -ForegroundColor Yellow
try {
    $supaStatus = npx supabase status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Running" -ForegroundColor Green
        $supaStatus | Select-String "API URL|Studio URL" | ForEach-Object { Write-Host "  $_" -ForegroundColor Cyan }
    } else {
        Write-Host "  Not running" -ForegroundColor Red
    }
} catch {
    Write-Host "  Error" -ForegroundColor Red
}

# Check HTTP endpoints
Write-Host "`nHTTP Endpoints:" -ForegroundColor Yellow
@{
    "Frontend" = "http://127.0.0.1:5173"
    "Supabase API" = "http://127.0.0.1:54321/rest/v1/"
} | ForEach-Object {
    $_.GetEnumerator() | ForEach-Object {
        try {
            $response = Invoke-WebRequest -Uri $_.Value -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
            Write-Host "  $($_.Key): $($response.StatusCode)" -ForegroundColor Green
        } catch {
            Write-Host "  $($_.Key): Not responding" -ForegroundColor Red
        }
    }
}

# Check ports
Write-Host "`nPorts:" -ForegroundColor Yellow
@(5173, 54321, 54326, 54323) | ForEach-Object {
    $port = $_
    $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($conn) {
        Write-Host "  Port $port : PID $($conn.OwningProcess)" -ForegroundColor Green
    } else {
        Write-Host "  Port $port : Not in use" -ForegroundColor Red
    }
}