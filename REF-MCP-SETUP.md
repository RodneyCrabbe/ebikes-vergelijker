# 🔧 Ref MCP Setup Guide

## Overview

Ref MCP (Model Context Protocol) is an advanced development tool that provides code analysis, refactoring, and development assistance capabilities. This guide will help you set up Ref MCP in your E-Bike Platform project.

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)
1. **Get your API key** from [https://ref.tools](https://ref.tools)
2. **Run the setup script**:
   ```bash
   # Double-click this file or run in terminal:
   SETUP-REF-MCP.bat
   ```
3. **Restart Cursor** to load the new MCP configuration

### Option 2: Manual Setup
1. **Get your API key** from [https://ref.tools](https://ref.tools)
2. **Update `mcp-config.json`** with your API key
3. **Restart Cursor**

## 📋 Prerequisites

- **Ref API Key**: Required for authentication
- **Cursor IDE**: MCP-compatible version
- **Internet Connection**: Required for API calls
- **Node.js**: For MCP server communication

## 🔑 Getting Your API Key

1. **Visit [https://ref.tools](https://ref.tools)**
2. **Sign up** for a new account or log in
3. **Navigate to API Settings** in your dashboard
4. **Generate a new API key**
5. **Copy the API key** (you'll need it for configuration)

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
        "--isolated=true"
      ]
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

### Environment Variables (`.env.local`)
```env
# Ref MCP Configuration
REF_API_KEY=your_api_key_here
REF_MCP_URL=https://api.ref.tools/mcp
```

## 🛠️ Available Tools

### Code Analysis
- **Code Quality Analysis** - Analyze code quality and suggest improvements
- **Performance Analysis** - Identify performance bottlenecks and optimization opportunities
- **Security Analysis** - Detect security vulnerabilities and suggest fixes
- **Dependency Analysis** - Analyze project dependencies and suggest updates

### Refactoring Tools
- **Code Refactoring** - Suggest and apply code refactoring improvements
- **Code Generation** - Generate boilerplate code and templates
- **Pattern Recognition** - Identify design patterns and suggest implementations
- **Code Optimization** - Optimize code for better performance and maintainability

### Development Assistance
- **Documentation Generation** - Generate comprehensive code documentation
- **Test Generation** - Generate unit tests and integration tests
- **API Documentation** - Generate API documentation from code
- **Code Review** - Perform automated code reviews

## 💡 Usage Examples

### Code Analysis
```
"Analyze the code quality of our Vue.js components"
"Check for performance issues in our e-bikes store"
"Review the security of our authentication system"
"Analyze our TypeScript configuration for improvements"
```

### Refactoring
```
"Suggest refactoring improvements for the e-bikes store"
"Optimize our image loading utility for better performance"
"Refactor our API caching system for better maintainability"
"Improve our error handling patterns"
```

### Documentation
```
"Generate documentation for our API endpoints"
"Create README for our utility functions"
"Document our component props and events"
"Generate API documentation for our Supabase integration"
```

### Testing
```
"Generate unit tests for our e-bikes store"
"Create integration tests for our API endpoints"
"Generate test cases for our utility functions"
"Create component tests for our Vue components"
```

## 🔧 Configuration Options

| Option | Description | Default | Required |
|--------|-------------|---------|----------|
| `apiKey` | Your Ref API key | - | ✅ Yes |
| `url` | Ref MCP server URL | `https://api.ref.tools/mcp` | ❌ No |
| `timeout` | Request timeout (ms) | `30000` | ❌ No |
| `retries` | Number of retry attempts | `3` | ❌ No |

## 🚨 Troubleshooting

### Common Issues

#### Authentication Errors
- **Problem**: `401 Unauthorized` or `403 Forbidden`
- **Solution**: Verify your API key is correct and active
- **Check**: API key format and expiration date

#### Connection Issues
- **Problem**: `Connection timeout` or `Network error`
- **Solution**: Check your internet connection and firewall settings
- **Check**: Corporate firewall blocking the API endpoint

#### Rate Limiting
- **Problem**: `429 Too Many Requests`
- **Solution**: Wait before making more requests
- **Check**: Your API usage limits in the Ref dashboard

#### API Errors
- **Problem**: `500 Internal Server Error` or other API errors
- **Solution**: Check the Ref API documentation for error codes
- **Check**: API service status and maintenance windows

### Debug Mode

Enable debug mode to see detailed logs:
```json
{
  "mcpServers": {
    "ref": {
      "type": "http",
      "url": "https://api.ref.tools/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY_HERE",
        "Content-Type": "application/json",
        "X-Debug": "true"
      }
    }
  }
}
```

## 📚 Resources

- **Ref MCP Documentation**: [https://ref.tools/docs](https://ref.tools/docs)
- **API Reference**: [https://ref.tools/api](https://ref.tools/api)
- **MCP Documentation**: [https://modelcontextprotocol.io/](https://modelcontextprotocol.io/)
- **Cursor MCP Guide**: [https://cursor.sh/docs/mcp](https://cursor.sh/docs/mcp)

## 🎯 Best Practices

### Security
- **Never commit API keys** to version control
- **Use environment variables** for sensitive data
- **Rotate API keys** regularly
- **Monitor API usage** for unusual activity

### Performance
- **Cache responses** when possible
- **Batch requests** to reduce API calls
- **Use appropriate timeouts** for different operations
- **Monitor rate limits** and usage patterns

### Development
- **Test with small code samples** first
- **Use specific prompts** for better results
- **Review generated code** before applying
- **Keep backups** of important files before refactoring

## 🆘 Support

If you encounter issues:

1. **Check this documentation** for common solutions
2. **Review the Ref API documentation** for specific errors
3. **Check your API key status** in the Ref dashboard
4. **Contact Ref support** for API-related issues
5. **Check Cursor MCP documentation** for integration issues

---

**🎉 Happy coding with Ref MCP!**
