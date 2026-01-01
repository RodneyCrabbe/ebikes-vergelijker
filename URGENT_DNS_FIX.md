# URGENT: Fix DNS - Domain Showing WordPress

## The Problem
Your domain is resolving to WordPress IPs (`64.29.17.65`, `216.198.79.1`) instead of Vercel, even though Vercel shows nameservers are correct.

## The Fix: Update Nameservers in SiteGround Domain Settings

**This is different from DNS Zone Editor!** You need to change nameservers at the **domain registrar level**.

### Step-by-Step:

1. **Log in to SiteGround**
   - Go to: https://www.siteground.com/
   - Log in to your account

2. **Go to Domain Manager**
   - Navigate to: **My Accounts → Domain Manager**
   - OR: **Websites → Domain Manager**

3. **Select Your Domain**
   - Click on: `ebikesvergelijker.nl`

4. **Change Nameservers**
   - Look for: **"Nameservers"** or **"DNS Settings"**
   - Change from SiteGround nameservers to:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - **Save/Apply changes**

5. **Wait 5-15 minutes**
   - DNS propagation takes time
   - Don't expect instant results

6. **Verify**
   - Check: https://www.whatsmydns.net/#A/ebikesvergelijker.nl
   - Should show Vercel IPs globally

## Alternative: If You Can't Change Nameservers

If SiteGround doesn't allow nameserver changes, you need to use **A records** instead:

1. **Go to DNS Zone Editor** (in SiteGround)
2. **Delete all existing A records**
3. **Add ONE A record:**
   - Name: `@` (or blank)
   - Type: `A`
   - Points to: `76.76.21.21` (Vercel's IP)
   - TTL: `3600`
4. **Save**

## Why This Happens

When you change nameservers to Vercel, you're telling the internet "Vercel controls all DNS for this domain." But if the domain registrar (SiteGround) still has the old nameservers in their system, DNS won't work correctly.

## Check Current Status

After making changes, verify:
```powershell
nslookup ebikesvergelijker.nl 8.8.8.8
```

Should show: `76.76.21.21` (Vercel)  
NOT: `64.29.17.65` or `216.198.79.1` (WordPress)

## Timeline

- **Immediate:** Nameserver change takes effect
- **5-15 minutes:** Most DNS servers update
- **Up to 48 hours:** Full global propagation (rare)

You don't need to wait 24 hours - it should work within 15-30 minutes after fixing nameservers in SiteGround.


