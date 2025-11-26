# Environment Setup Guide

This guide ensures your development environment is properly configured to prevent common startup issues.

## Quick Start

```bash
# 1. Check and setup environment
npm run setup

# 2. Start development server
npm run dev
```

## Environment Variables

The application requires the following environment variables:

### Required Variables

| Variable | Description | Default (Development) |
|----------|-------------|----------------------|
| `VITE_SUPABASE_URL` | Supabase API URL | `http://127.0.0.1:54321` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Auto-generated for local development |

### Automatic Setup

The application includes automatic environment validation:

1. **Startup Check**: Runs before the app starts
2. **Auto-Creation**: Creates `.env` file if missing
3. **Validation**: Verifies all required variables are present
4. **Fallback**: Uses safe defaults if variables are missing

## Common Issues & Solutions

### Issue: E-bikes not displaying

**Symptoms:**
- App loads but no e-bikes show up
- Console shows "Store E-bikes Count: 0"
- Supabase connection errors

**Solution:**
```bash
# 1. Check environment
npm run dev:check

# 2. Restart development server
npm run dev

# 3. If still failing, full restart
npm run full-restart
```

### Issue: Environment variables not loading

**Symptoms:**
- Console shows "Using fallback configuration"
- Supabase connection fails
- App shows health check errors

**Solution:**
```bash
# 1. Verify .env file exists
ls -la .env

# 2. Check .env content
cat .env

# 3. Recreate .env if needed
rm .env
npm run dev:check

# 4. Restart server
npm run dev
```

### Issue: Supabase not running

**Symptoms:**
- Health check shows "Supabase connection failed"
- Network errors in console
- Database queries fail

**Solution:**
```bash
# 1. Check Supabase status
npm run supabase:status

# 2. Start Supabase if needed
npm run supabase:start

# 3. Wait for startup, then restart app
npm run dev
```

## Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with environment check |
| `npm run dev:check` | Check environment configuration only |
| `npm run setup` | Full environment setup and validation |
| `npm run health-check` | Quick environment validation |
| `npm run full-restart` | Clean restart of all services |

## Health Check System

The application includes a comprehensive health check system:

### What it checks:
- ✅ Environment variables are present and valid
- ✅ Browser features are available
- ✅ Supabase connection is working
- ✅ Database is accessible

### When it runs:
- On application startup
- Before critical operations
- When environment changes are detected

### Error handling:
- Shows user-friendly error messages
- Provides specific guidance for fixes
- Continues with fallback behavior when possible

## Troubleshooting

### 1. Environment File Issues

```bash
# Check if .env exists
ls -la .env

# View .env content
cat .env

# Recreate .env
rm .env && npm run dev:check
```

### 2. Supabase Connection Issues

```bash
# Check Supabase status
npm run supabase:status

# Restart Supabase
npm run supabase:stop
npm run supabase:start

# Check logs
npx supabase logs
```

### 3. Development Server Issues

```bash
# Clean restart
npm run clean
npm run dev

# Full system restart
npm run full-restart
```

### 4. Build Issues

```bash
# Check environment before build
npm run dev:check

# Build with environment validation
npm run build
```

## Best Practices

1. **Always run `npm run setup`** when setting up the project
2. **Check environment** before starting development
3. **Restart server** after modifying `.env` file
4. **Use health check** to diagnose issues
5. **Keep Supabase running** during development

## Production Deployment

For production deployment:

1. Set proper environment variables in your hosting platform
2. Ensure Supabase is properly configured
3. Run `npm run build` to verify environment
4. Test the built application before deployment

## Support

If you encounter issues not covered in this guide:

1. Check the browser console for detailed error messages
2. Run `npm run health-check` for system status
3. Review the application logs for specific errors
4. Ensure all dependencies are properly installed
