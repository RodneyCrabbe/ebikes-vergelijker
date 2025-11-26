# Deployment Checklist

## Database
- [ ] Supabase project created
- [ ] Database migrations applied
- [ ] RLS policies verified
- [ ] Seed data loaded (if needed)
- [ ] Database backup configured

## Configuration
- [ ] Environment variables set
- [ ] JWT expiry set to 8 hours
- [ ] Auth providers configured
- [ ] CORS settings configured

## Code
- [ ] Production build successful
- [ ] Console logs removed
- [ ] Error boundary implemented
- [ ] Environment validation passing

## Testing
- [ ] Authentication flow tested
- [ ] E-bikes loading tested
- [ ] Auto-refresh working
- [ ] Error handling verified
- [ ] Mobile responsiveness checked

## Performance
- [ ] Lighthouse score > 90
- [ ] No memory leaks
- [ ] API response times < 500ms
- [ ] Images optimized

## Local Development Fixes
- [ ] Database persistence via Docker volumes
- [ ] Backup/restore scripts working
- [ ] Auto-refresh for e-bikes data
- [ ] Authentication persistence fixed
- [ ] Error boundaries implemented
