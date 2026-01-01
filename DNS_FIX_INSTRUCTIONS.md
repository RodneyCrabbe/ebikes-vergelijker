# DNS Fix: Point Domain to Vercel Instead of WordPress

## Problem
Your domain `ebikesvergelijker.nl` is currently showing the WordPress site instead of your Vercel app.

## Solution: Update DNS Records

You have **two options**:

---

## Option 1: Use CNAME Record (Recommended for Vercel)

Vercel prefers CNAME records for better reliability. This is the modern approach:

### Steps:
1. **Log in to SiteGround** → **Domains** → **DNS Zone Editor**
2. **Remove or update the existing A record** pointing to `76.76.21.21`
3. **Add a CNAME record:**
   - **Name/Host:** `@` (or leave blank for root domain)
   - **Type:** `CNAME`
   - **Points to:** `cname.vercel-dns.com`
   - **TTL:** `3600` (or default)

**Note:** Some DNS providers don't allow CNAME on root domain (@). If SiteGround doesn't allow this, use Option 2.

---

## Option 2: Use A Record (Current Method - Verify IP)

The A record should point to Vercel's IP. Let's verify:

### Steps:
1. **Log in to SiteGround** → **Domains** → **DNS Zone Editor**
2. **Check your current A record:**
   - If it points to SiteGround's IP (not `76.76.21.21`), that's the problem!
3. **Update the A record:**
   - **Name/Host:** `@` (or leave blank)
   - **Type:** `A`
   - **Points to:** `76.76.21.21` (Vercel's IP)
   - **TTL:** `3600`

4. **Remove any conflicting A records** that point to SiteGround's WordPress server

---

## Option 3: Use Vercel Nameservers (Best for Full Control)

This gives Vercel complete control over DNS:

### Steps:
1. **Log in to SiteGround** → **Domains** → **Nameservers**
2. **Change nameservers to:**
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
3. **Save changes**

**Note:** This will move ALL DNS management to Vercel. You'll manage DNS records in Vercel dashboard instead of SiteGround.

---

## Verify Current DNS

Check what your domain currently points to:

```powershell
# Check current A record
nslookup ebikesvergelijker.nl

# Check what IP it resolves to
Resolve-DnsName ebikesvergelijker.nl -Type A
```

If it shows SiteGround's IP instead of `76.76.21.21`, that's why you see WordPress.

---

## After Making Changes

1. **Wait 5-15 minutes** for DNS propagation
2. **Clear your browser cache** or use incognito mode
3. **Test:** Visit `https://ebikesvergelijker.nl`
4. **Check Vercel dashboard** for domain verification status

---

## Important Notes

- **WordPress API:** Your WordPress API at `https://ebikesvergelijker.nl/wp-json` will still work even when the domain points to Vercel, as long as WordPress is accessible via subdomain or you configure it separately
- **Subdomain Option:** Consider using a subdomain like `wp.ebikesvergelijker.nl` for WordPress if you need both
- **DNS Propagation:** Can take up to 48 hours globally, but usually 5-15 minutes

---

## Quick Check: What's Your Current Setup?

Run this to see what your domain currently points to:

```powershell
Resolve-DnsName ebikesvergelijker.nl -Type A | Select-Object Name, IPAddress
```

If the IP is NOT `76.76.21.21`, that's the issue!


