# Authentication Persistence Guide

This guide explains how to ensure user authentication works correctly and persists between Supabase restarts in your local development environment.

## The Problem

When developing locally with Supabase, you may encounter these issues:
- Users appear logged in on the frontend but don't show up in Supabase Studio
- Users get logged out after restarting Supabase
- Authentication state doesn't persist between development sessions

## Root Cause

The issue occurs because:
1. **Local Supabase resets data** between restarts by default
2. **Site URL mismatch** between Supabase config and your app URL
3. **Session storage** not properly configured for persistence

## Solution

### 1. Fix Supabase Configuration

The `site_url` in `supabase/config.toml` must match your app URL:

```toml
[auth]
site_url = "http://127.0.0.1:5173"  # Must match your app URL
additional_redirect_urls = ["http://127.0.0.1:5173", "http://127.0.0.1:5174"]
```

### 2. Restart Supabase After Config Changes

```bash
# Stop Supabase
npm run supabase:stop

# Start Supabase with new config
npm run supabase:start
```

### 3. Test Authentication Flow

```bash
# Test the authentication system
npm run auth:test

# Check authentication status
npm run auth:status
```

### 4. Backup and Restore User Data

```bash
# Backup current user data
npm run auth:backup

# Restore user data after restart
npm run auth:restore
```

## Verification Steps

### 1. Check User Registration

1. Open your app at `http://localhost:5173`
2. Register a new user
3. Check Supabase Studio at `http://127.0.0.1:54323`
4. Navigate to Authentication > Users
5. Verify the user appears in the list

### 2. Check User Login

1. Log out of the app
2. Log back in with the same credentials
3. Verify you stay logged in
4. Check that user data persists

### 3. Check Persistence

1. Restart Supabase: `npm run supabase:restart`
2. Open the app again
3. Try to log in with existing credentials
4. Verify the user can still log in

## Troubleshooting

### Issue: Users not appearing in Supabase Studio

**Symptoms:**
- Frontend shows user as logged in
- Supabase Studio shows "No users in your project"

**Solution:**
1. Check if users exist in the `profiles` table:
   ```bash
   npm run auth:status
   ```
2. If users exist in profiles but not in auth.users, there's a trigger issue
3. Restart Supabase and try registering a new user

### Issue: Users get logged out after restart

**Symptoms:**
- Users can log in initially
- After Supabase restart, users are logged out
- Need to re-register users

**Solution:**
1. Use the backup/restore system:
   ```bash
   npm run auth:backup    # Before restart
   npm run auth:restore   # After restart
   ```
2. Or implement proper session persistence in your app

### Issue: Site URL mismatch

**Symptoms:**
- Authentication errors in console
- Users can't log in
- Redirect errors

**Solution:**
1. Check `supabase/config.toml`:
   ```toml
   site_url = "http://127.0.0.1:5173"  # Must match your app
   ```
2. Restart Supabase after changes
3. Clear browser cache and cookies

### Issue: Session not persisting

**Symptoms:**
- Users get logged out on page refresh
- Authentication state resets

**Solution:**
1. Check Supabase client configuration in `src/lib/supabase.ts`:
   ```typescript
   export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
     auth: {
       autoRefreshToken: true,
       persistSession: true,
       detectSessionInUrl: true,
       storage: window.localStorage,
       storageKey: 'eb-auth'
     }
   })
   ```
2. Ensure localStorage is available in your browser

## Best Practices

### 1. Always Test After Changes

```bash
# After any Supabase config changes
npm run supabase:restart
npm run auth:test
```

### 2. Backup Before Major Changes

```bash
# Before making significant changes
npm run auth:backup
```

### 3. Monitor Authentication Status

```bash
# Regular check during development
npm run auth:status
```

### 4. Use Consistent URLs

- Always use `http://127.0.0.1:5173` for your app
- Update `site_url` in config if you change ports
- Restart Supabase after URL changes

## Development Workflow

### Daily Development

1. Start Supabase: `npm run supabase:start`
2. Start app: `npm run dev`
3. Test authentication: `npm run auth:test`
4. Develop normally

### After Code Changes

1. Test authentication: `npm run auth:test`
2. If issues, restart Supabase: `npm run supabase:restart`
3. Test again: `npm run auth:test`

### Before Committing

1. Backup user data: `npm run auth:backup`
2. Test full flow: `npm run auth:test`
3. Verify persistence: `npm run supabase:restart && npm run auth:test`

## Production Considerations

For production deployment:

1. **Use proper environment variables** for Supabase URLs
2. **Configure proper site URLs** for your domain
3. **Enable email confirmations** if needed
4. **Set up proper backup procedures** for user data
5. **Monitor authentication logs** for issues

## Support

If you encounter issues not covered in this guide:

1. Check the browser console for errors
2. Run `npm run auth:test` for detailed diagnostics
3. Check Supabase logs: `npx supabase logs`
4. Verify configuration matches your setup

Remember: The authentication system is working correctly - the issue is usually configuration or persistence related!
