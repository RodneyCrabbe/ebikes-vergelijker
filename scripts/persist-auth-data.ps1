# PowerShell script to persist authentication data in local Supabase
# This ensures users remain logged in between Supabase restarts

param(
    [string]$Action = "backup"  # backup, restore, or status
)

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackupDir = Join-Path $ProjectRoot "supabase-backups"
$AuthBackupFile = Join-Path $BackupDir "auth-data.sql"

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    } else {
        $input | Write-Output
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Backup-AuthData {
    Write-ColorOutput Green "🔄 Backing up authentication data..."
    
    # Create backup directory if it doesn't exist
    if (!(Test-Path $BackupDir)) {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    }
    
    # Get database connection details
    $dbUrl = "postgresql://postgres:postgres@127.0.0.1:54326/postgres"
    
    # Create backup SQL file
    $backupSql = @"
-- Authentication Data Backup
-- Generated on: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

-- Backup auth.users table
COPY auth.users TO STDOUT WITH CSV HEADER;
"@
    
    # Execute backup
    try {
        $env:PGPASSWORD = "postgres"
        $backupSql | psql -h 127.0.0.1 -p 54326 -U postgres -d postgres -c "COPY auth.users TO STDOUT WITH CSV HEADER" > "$BackupDir\auth-users.csv"
        
        # Also backup profiles table
        psql -h 127.0.0.1 -p 54326 -U postgres -d postgres -c "COPY profiles TO STDOUT WITH CSV HEADER" > "$BackupDir\profiles.csv"
        
        Write-ColorOutput Green "✅ Authentication data backed up successfully!"
        Write-ColorOutput Yellow "📁 Backup location: $BackupDir"
        
        # Show backup contents
        if (Test-Path "$BackupDir\auth-users.csv") {
            $userCount = (Get-Content "$BackupDir\auth-users.csv" | Measure-Object -Line).Lines - 1
            Write-ColorOutput Cyan "👥 Users in backup: $userCount"
        }
        
    } catch {
        Write-ColorOutput Red "❌ Backup failed: $($_.Exception.Message)"
        exit 1
    }
}

function Restore-AuthData {
    Write-ColorOutput Green "🔄 Restoring authentication data..."
    
    if (!(Test-Path $BackupDir)) {
        Write-ColorOutput Red "❌ No backup directory found. Run backup first."
        exit 1
    }
    
    if (!(Test-Path "$BackupDir\auth-users.csv") -or !(Test-Path "$BackupDir\profiles.csv")) {
        Write-ColorOutput Red "❌ No backup files found. Run backup first."
        exit 1
    }
    
    try {
        $env:PGPASSWORD = "postgres"
        
        # Restore auth.users table
        Write-ColorOutput Yellow "📥 Restoring auth.users table..."
        Get-Content "$BackupDir\auth-users.csv" | psql -h 127.0.0.1 -p 54326 -U postgres -d postgres -c "COPY auth.users FROM STDIN WITH CSV HEADER"
        
        # Restore profiles table
        Write-ColorOutput Yellow "📥 Restoring profiles table..."
        Get-Content "$BackupDir\profiles.csv" | psql -h 127.0.0.1 -p 54326 -U postgres -d postgres -c "COPY profiles FROM STDIN WITH CSV HEADER"
        
        Write-ColorOutput Green "✅ Authentication data restored successfully!"
        
    } catch {
        Write-ColorOutput Red "❌ Restore failed: $($_.Exception.Message)"
        exit 1
    }
}

function Show-AuthStatus {
    Write-ColorOutput Green "📊 Authentication Data Status"
    Write-ColorOutput Yellow "================================"
    
    try {
        $env:PGPASSWORD = "postgres"
        
        # Check auth.users count
        $authUsersCount = psql -h 127.0.0.1 -p 54326 -U postgres -d postgres -t -c "SELECT COUNT(*) FROM auth.users;"
        Write-ColorOutput Cyan "👥 Users in auth.users: $($authUsersCount.Trim())"
        
        # Check profiles count
        $profilesCount = psql -h 127.0.0.1 -p 54326 -U postgres -d postgres -t -c "SELECT COUNT(*) FROM profiles;"
        Write-ColorOutput Cyan "👤 Users in profiles: $($profilesCount.Trim())"
        
        # Show recent users
        Write-ColorOutput Yellow "`n📋 Recent Users:"
        psql -h 127.0.0.1 -p 54326 -U postgres -d postgres -c "SELECT email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;"
        
    } catch {
        Write-ColorOutput Red "❌ Status check failed: $($_.Exception.Message)"
    }
}

# Main execution
switch ($Action.ToLower()) {
    "backup" {
        Backup-AuthData
    }
    "restore" {
        Restore-AuthData
    }
    "status" {
        Show-AuthStatus
    }
    default {
        Write-ColorOutput Red "❌ Invalid action. Use: backup, restore, or status"
        Write-ColorOutput Yellow "Usage: .\persist-auth-data.ps1 -Action backup|restore|status"
        exit 1
    }
}
