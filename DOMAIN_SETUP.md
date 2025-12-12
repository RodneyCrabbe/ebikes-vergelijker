# Custom Domain Setup Guide

## Domain Configuration

Your custom domain `ebikesvergelijker.nl` has been added to your Vercel project.

## DNS Configuration on SiteGround

To complete the setup, you need to configure DNS records on SiteGround. You have two options:

### Option 1: Add A Record (Recommended)

This keeps your SiteGround nameservers and just points the domain to Vercel.

1. Log in to your SiteGround account
2. Go to **Domains** → **DNS Zone Editor**
3. Select `ebikesvergelijker.nl`
4. Add a new **A Record** with the following:
   - **Name/Host:** `@` (or leave blank for root domain)
   - **Points to:** `76.76.21.21`
   - **TTL:** `3600` (or default)

5. Save the record

### Option 2: Change Nameservers (Alternative)

If you prefer to use Vercel's nameservers:

1. Log in to your SiteGround account
2. Go to **Domains** → **Nameservers**
3. Change nameservers to:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

## Verification

After configuring DNS:

1. Wait 5-10 minutes for DNS propagation
2. Vercel will automatically verify the domain
3. You'll receive an email when verification is complete
4. Your site will be accessible at `https://ebikesvergelijker.nl`

## SSL Certificate

Vercel automatically provisions SSL certificates for your custom domain. This usually happens within a few minutes after DNS verification.

## Testing

Once DNS is configured, test your domain:

```bash
# Check DNS propagation
nslookup ebikesvergelijker.nl

# Test HTTPS
curl -I https://ebikesvergelijker.nl
```

## Important Notes

- DNS changes can take up to 48 hours to propagate globally (usually much faster)
- The old Vercel domain (`ebikes-vergelijker-ztl7.vercel.app`) will continue to work
- Both domains will serve the same content
- For SEO purposes, you may want to set up redirects from the old domain to the new one

## Troubleshooting

If the domain doesn't work after 24 hours:

1. Verify DNS records are correct
2. Check Vercel dashboard for domain status
3. Ensure no conflicting DNS records exist
4. Contact Vercel support if issues persist

