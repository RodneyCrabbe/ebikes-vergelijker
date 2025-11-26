# Restore local Supabase database
param(
    [string]$backupFile
)

if (-not $backupFile) {
    Write-Host "Usage: .\restore-local-db.ps1 -backupFile path\to\backup.sql"
    Write-Host ""
    Write-Host "Available backups:"
    Get-ChildItem "supabase/backups" -Filter "backup_*.sql" | 
        Sort-Object LastWriteTime -Descending | 
        ForEach-Object { Write-Host "  $($_.Name)" }
    exit 1
}

if (-not (Test-Path $backupFile)) {
    Write-Error "Backup file not found: $backupFile"
    exit 1
}

Write-Host "Restoring from: $backupFile"
Write-Host "This will replace all data in the local database!"
Write-Host "Press Ctrl+C to cancel, or any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

try {
    Write-Host "Starting restore process..."
    
    # Stop Supabase to ensure clean restore
    Write-Host "Stopping Supabase services..."
    npx supabase stop
    
    # Start only the database
    Write-Host "Starting database service..."
    npx supabase start --ignore-health-check
    
    # Wait a moment for database to be ready
    Start-Sleep -Seconds 5
    
    # Restore the database
    Write-Host "Restoring database..."
    Get-Content $backupFile | docker exec -i supabase_db_ebike-platform psql -U postgres postgres
    
    Write-Host "Restore completed successfully!"
    Write-Host "Starting all Supabase services..."
    npx supabase start
    
    Write-Host "Database restored and services restarted!"
} catch {
    Write-Error "Restore failed: $_"
    Write-Host "Attempting to restart Supabase services..."
    npx supabase start
    exit 1
}
