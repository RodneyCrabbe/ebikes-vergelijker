# Ref MCP Setup Script for E-Bike Platform
Write-Host "🔧 Setting up Ref MCP for E-Bike Platform..." -ForegroundColor Green
Write-Host ""

# Check if API key is provided
$apiKey = Read-Host "Enter your Ref API key (get it from https://ref.tools)"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "❌ API key is required. Please get one from https://ref.tools" -ForegroundColor Red
    Write-Host ""
    Write-Host "Steps to get your API key:" -ForegroundColor Yellow
    Write-Host "1. Visit https://ref.tools" -ForegroundColor White
    Write-Host "2. Sign up for an account" -ForegroundColor White
    Write-Host "3. Navigate to API settings" -ForegroundColor White
    Write-Host "4. Generate a new API key" -ForegroundColor White
    Write-Host "5. Copy the API key and run this script again" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ API key provided" -ForegroundColor Green
Write-Host ""

# Update MCP configuration
Write-Host "📝 Updating MCP configuration..." -ForegroundColor Yellow

$mcpConfigPath = "mcp-config.json"
$mcpConfig = Get-Content $mcpConfigPath -Raw | ConvertFrom-Json

# Update the Ref MCP configuration with the actual API key
$mcpConfig.mcpServers.ref.headers.Authorization = "Bearer $apiKey"

# Convert back to JSON and save
$mcpConfig | ConvertTo-Json -Depth 10 | Set-Content $mcpConfigPath

Write-Host "✅ MCP configuration updated" -ForegroundColor Green
Write-Host ""

# Create environment file for API key
Write-Host "🔐 Creating environment file..." -ForegroundColor Yellow
$envContent = @"
# Ref MCP Configuration
REF_API_KEY=$apiKey
REF_MCP_URL=https://api.ref.tools/mcp
"@

$envContent | Set-Content ".env.local"

Write-Host "✅ Environment file created" -ForegroundColor Green
Write-Host ""

# Test the configuration
Write-Host "🧪 Testing Ref MCP configuration..." -ForegroundColor Yellow

try {
    $testResponse = Invoke-RestMethod -Uri "https://api.ref.tools/mcp" -Method GET -Headers @{
        "Authorization" = "Bearer $apiKey"
        "Content-Type" = "application/json"
    } -TimeoutSec 10
    
    Write-Host "✅ Ref MCP connection successful" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Ref MCP connection test failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "This might be normal if the API requires specific endpoints" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 Ref MCP Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Configuration Summary:" -ForegroundColor White
Write-Host "- API Key: $($apiKey.Substring(0, 8))..." -ForegroundColor White
Write-Host "- MCP URL: https://api.ref.tools/mcp" -ForegroundColor White
Write-Host "- Configuration: mcp-config.json" -ForegroundColor White
Write-Host "- Environment: .env.local" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Restart Cursor to load the new MCP configuration" -ForegroundColor White
Write-Host "2. Test Ref MCP commands in your development workflow" -ForegroundColor White
Write-Host "3. Use Ref MCP for code analysis and refactoring" -ForegroundColor White
Write-Host ""
Write-Host "💡 Example Commands:" -ForegroundColor Yellow
Write-Host "- 'Analyze the code quality of our Vue.js components'" -ForegroundColor White
Write-Host "- 'Suggest refactoring improvements for the e-bikes store'" -ForegroundColor White
Write-Host "- 'Generate documentation for our API endpoints'" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
