# 🌐 Browser MCP Setup Guide

## Overview

Browser MCP (Model Context Protocol) is a powerful tool for web automation, testing, and scraping. This guide will help you set up Browser MCP in your E-Bike Platform project.

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)
1. **Run the setup script**:
   ```bash
   # Double-click this file or run in terminal:
   SETUP-BROWSER-MCP.bat
   ```
2. **Restart Cursor** to load the new MCP configuration

### Option 2: Manual Setup
1. **Install the package**:
   ```bash
   npm install -g @browsermcp/mcp@latest
   ```
2. **Verify installation**:
   ```bash
   npx @browsermcp/mcp@latest --version
   ```
3. **Restart Cursor**

## 📋 Prerequisites

- **Node.js**: Version 18+ required
- **npm**: Package manager for Node.js
- **Cursor IDE**: MCP-compatible version
- **Internet Connection**: Required for package installation

## ⚙️ Configuration Details

### MCP Configuration File (`mcp-config.json`)
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--headless=false",
        "--isolated=true",
        "--viewport=1280x720"
      ],
      "env": {
        "DEBUG": "*"
      }
    },
    "browsermcp": {
      "command": "npx",
      "args": ["@browsermcp/mcp@latest"]
    },
    "ref": {
      "type": "http",
      "url": "https://api.ref.tools/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY_HERE",
        "Content-Type": "application/json"
      }
    }
  }
}
```

## 🛠️ Available Tools

### Web Automation
- **Page Navigation** - Navigate to URLs and manage browser sessions
- **Element Interaction** - Click, type, and interact with web elements
- **Form Filling** - Automate form submissions and data entry
- **Screenshot Capture** - Take screenshots of web pages or specific elements
- **Content Extraction** - Extract text, links, and data from web pages

### Testing & Validation
- **E2E Testing** - End-to-end testing of web applications
- **Performance Testing** - Measure page load times and performance metrics
- **Accessibility Testing** - Validate web accessibility standards
- **Cross-browser Testing** - Test across different browsers and devices
- **Visual Regression Testing** - Compare screenshots for visual changes

### Web Scraping
- **Data Extraction** - Scrape product information, prices, and specifications
- **Content Monitoring** - Monitor website changes and updates
- **API Testing** - Test web APIs and endpoints
- **User Journey Testing** - Simulate user workflows and interactions

## 💡 Usage Examples

### E-Bike Platform Testing
```
"Take a screenshot of our e-bike platform homepage"
"Test the e-bike comparison functionality end-to-end"
"Validate the performance of our image loading"
"Check accessibility compliance on our product pages"
"Test the booking form submission process"
```

### Web Scraping & Data Collection
```
"Scrape competitor e-bike prices for market analysis"
"Extract product specifications from dealer websites"
"Monitor our website for broken links"
"Validate responsive design across different screen sizes"
"Test the search functionality with different queries"
```

### Performance & Quality Assurance
```
"Measure page load times for our e-bike listings"
"Test the filtering system with various criteria"
"Validate form validation and error handling"
"Check mobile responsiveness on different devices"
"Test the checkout process end-to-end"
```

## 🔧 Configuration Options

| Option | Description | Default | Required |
|--------|-------------|---------|----------|
| `command` | Command to run Browser MCP | `npx` | ✅ Yes |
| `args` | Arguments for the command | `["@browsermcp/mcp@latest"]` | ✅ Yes |
| `env` | Environment variables | `{}` | ❌ No |
| `cwd` | Working directory | Current directory | ❌ No |

## 🚨 Troubleshooting

### Common Issues

#### Installation Errors
- **Problem**: `npm install` fails
- **Solution**: Check Node.js version (18+ required) and internet connection
- **Check**: Run `node --version` and `npm --version`

#### Permission Errors
- **Problem**: Permission denied during installation
- **Solution**: Run as administrator or use `npx` instead of global install
- **Check**: Try `npx @browsermcp/mcp@latest --version`

#### Cursor Integration Issues
- **Problem**: Browser MCP not available in Cursor
- **Solution**: Restart Cursor after configuration changes
- **Check**: Verify `mcp-config.json` syntax

#### Browser Launch Issues
- **Problem**: Browser fails to launch
- **Solution**: Check if Chrome/Chromium is installed
- **Check**: Try running `npx @browsermcp/mcp@latest --help`

### Debug Mode

Enable debug mode to see detailed logs:
```json
{
  "mcpServers": {
    "browsermcp": {
      "command": "npx",
      "args": ["@browsermcp/mcp@latest", "--debug"],
      "env": {
        "DEBUG": "*"
      }
    }
  }
}
```

## 📚 Resources

- **Browser MCP Documentation**: [GitHub Repository](https://github.com/browsermcp/mcp)
- **MCP Documentation**: [Model Context Protocol](https://modelcontextprotocol.io/)
- **Cursor MCP Guide**: [Cursor Documentation](https://cursor.sh/docs/mcp)
- **Web Automation Best Practices**: [Puppeteer Documentation](https://pptr.dev/)

## 🎯 Best Practices

### Security
- **Sandboxed Execution** - Run in isolated environments
- **Input Validation** - Validate all user inputs
- **Rate Limiting** - Respect website rate limits
- **User Agent Rotation** - Use different user agents for scraping

### Performance
- **Headless Mode** - Use headless browsers for better performance
- **Resource Management** - Close browsers and clear resources
- **Concurrent Limits** - Limit concurrent browser instances
- **Timeout Handling** - Set appropriate timeouts

### Development
- **Test Locally** - Test automation scripts locally first
- **Error Handling** - Implement comprehensive error handling
- **Logging** - Add detailed logging for debugging
- **Version Control** - Keep automation scripts in version control

## 🆘 Support

If you encounter issues:

1. **Check this documentation** for common solutions
2. **Review the Browser MCP logs** for error details
3. **Verify your configuration** in `mcp-config.json`
4. **Test with simple commands** first
5. **Check the Browser MCP repository** for updates

## 🔄 Updates

To update Browser MCP:
```bash
npm update -g @browsermcp/mcp@latest
```

Or use the latest version directly:
```bash
npx @browsermcp/mcp@latest
```

---

**🎉 Happy automating with Browser MCP!**
