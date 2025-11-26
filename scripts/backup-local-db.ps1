# Backup local Supabase database
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "supabase/backups"
$backupFile = "$backupDir/backup_$timestamp.sql"

# Create backups directory if it doesn't exist
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force
    Write-Host "Created backup directory: $backupDir"
}

Write-Host "Creating backup: $backupFile"
Write-Host "This may take a few moments..."

try {
    # Create backup using pg_dump
    docker exec supabase_db_ebike-platform pg_dump -U postgres postgres > $backupFile
    
    if (Test-Path $backupFile) {
        $fileSize = (Get-Item $backupFile).Length
        Write-Host "Backup completed successfully!"
        Write-Host "File: $backupFile"
        Write-Host "Size: $([math]::Round($fileSize/1KB, 2)) KB"
        
        # Keep only the last 5 backups
        Get-ChildItem $backupDir -Filter "backup_*.sql" | 
            Sort-Object LastWriteTime -Descending | 
            Select-Object -Skip 5 | 
            Remove-Item -Force
        
        Write-Host "Cleaned up old backups (kept last 5)"
    } else {
        Write-Error "Backup file was not created"
        exit 1
    }
} catch {
    Write-Error "Backup failed: $_"
    exit 1
}
