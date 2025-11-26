# Browser MCP Setup Script for E-Bike Platform
Write-Host "🌐 Setting up Browser MCP for E-Bike Platform..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
Write-Host "[1/4] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Node.js not found"
    }
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is required but not installed" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Check if npm is available
Write-Host "[2/4] Checking npm availability..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "npm not found"
    }
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is required but not available" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Install Browser MCP package
Write-Host "[3/4] Installing Browser MCP package..." -ForegroundColor Yellow
try {
    Write-Host "Installing @browsermcp/mcp@latest..." -ForegroundColor White
    npm install -g @browsermcp/mcp@latest
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to install Browser MCP"
    }
    Write-Host "✅ Browser MCP installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install Browser MCP" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host ""
    Write-Host "Trying alternative installation method..." -ForegroundColor Yellow
    
    try {
        npx @browsermcp/mcp@latest --version
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Browser MCP is available via npx" -ForegroundColor Green
        } else {
            throw "Browser MCP not available"
        }
    } catch {
        Write-Host "❌ Browser MCP installation failed" -ForegroundColor Red
        Write-Host "Please check your internet connection and try again" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
}
Write-Host ""

# Test Browser MCP installation
Write-Host "[4/4] Testing Browser MCP installation..." -ForegroundColor Yellow
try {
    Write-Host "Testing Browser MCP..." -ForegroundColor White
    npx @browsermcp/mcp@latest --help > $null 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Browser MCP is working correctly" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Browser MCP installed but may have issues" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not test Browser MCP, but installation completed" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 Browser MCP Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Configuration Summary:" -ForegroundColor White
Write-Host "- Package: @browsermcp/mcp@latest" -ForegroundColor White
Write-Host "- Command: npx @browsermcp/mcp@latest" -ForegroundColor White
Write-Host "- Configuration: mcp-config.json" -ForegroundColor White
Write-Host "- Cursor Rules: .cursorrules" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Browser MCP Capabilities:" -ForegroundColor Yellow
Write-Host "- Web automation and testing" -ForegroundColor White
Write-Host "- Screenshot capture and visual testing" -ForegroundColor White
Write-Host "- Form filling and user interaction simulation" -ForegroundColor White
Write-Host "- Performance and accessibility testing" -ForegroundColor White
Write-Host "- Web scraping and data extraction" -ForegroundColor White
Write-Host ""
Write-Host "💡 Example Commands:" -ForegroundColor Yellow
Write-Host "- 'Take a screenshot of our e-bike platform'" -ForegroundColor White
Write-Host "- 'Test the e-bike comparison functionality'" -ForegroundColor White
Write-Host "- 'Validate performance of our image loading'" -ForegroundColor White
Write-Host "- 'Check accessibility compliance on product pages'" -ForegroundColor White
Write-Host ""
Write-Host "🔄 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Restart Cursor to load the new MCP configuration" -ForegroundColor White
Write-Host "2. Test Browser MCP commands in your development workflow" -ForegroundColor White
Write-Host "3. Use Browser MCP for automated testing and validation" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
