# DNS Fix - Domain Showing WordPress Instead of Vercel App

## Problem
Your domain `ebikesvergelijker.nl` is resolving to WordPress IPs instead of Vercel, even though nameservers are set to Vercel.

## Root Cause
DNS propagation is incomplete. The nameservers are set to Vercel, but some DNS servers worldwide are still resolving to the old WordPress IPs.

## Solution: Force DNS Update

### Option 1: Verify Nameservers in SiteGround (Recommended)

Even though nameservers are set to Vercel, you need to ensure SiteGround isn't overriding them:

1. **Log in to SiteGround**
2. Go to: **Domains → Domain Manager**
3. Select: `ebikesvergelijker.nl`
4. Check **Nameservers** section
5. **Ensure they are set to:**
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
6. If they show SiteGround nameservers, **change them to Vercel's**
7. **Save changes**

### Option 2: Remove All A Records in SiteGround

If you're using Vercel nameservers, you shouldn't have A records in SiteGround:

1. **Log in to SiteGround**
2. Go to: **Domains → DNS Zone Editor**
3. Select: `ebikesvergelijker.nl`
4. **Delete ALL A records** (especially ones pointing to WordPress IPs)
5. **Save changes**

### Option 3: Wait for DNS Propagation

DNS changes can take:
- **5-15 minutes** for most users
- **Up to 48 hours** globally (rare)

You can check propagation status at: https://www.whatsmydns.net/#A/ebikesvergelijker.nl

## Verify It's Working

After making changes, wait 5-10 minutes, then:

```powershell
# Check DNS from Google's DNS
nslookup ebikesvergelijker.nl 8.8.8.8

# Should show Vercel IPs (76.76.21.21 or similar)
# NOT WordPress IPs (64.29.17.65, 216.198.79.1)
```

## Current Status

- ✅ Nameservers set to Vercel in Vercel dashboard
- ❌ DNS still resolving to WordPress IPs globally
- ⏳ Waiting for DNS propagation OR nameservers need to be verified in SiteGround

## Quick Test

Try accessing your site from:
- Different browser (incognito mode)
- Different network (mobile data)
- Different device

If it works elsewhere, it's your local DNS cache. Clear it:
```powershell
ipconfig /flushdns
```


