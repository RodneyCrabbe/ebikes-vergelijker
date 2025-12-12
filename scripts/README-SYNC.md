# WordPress Sync Script

This script syncs e-bike data from `src/data/ebikes.json` to WordPress.

## Setup

Add the following environment variables to your `.env` file:

```env
VITE_WP_API_URL=https://your-wordpress-site.com/wp-json
WP_USERNAME=your-wordpress-username
WP_PASSWORD=your-wordpress-password
```

## Usage

Run the sync script:

```bash
node scripts/sync-to-wordpress.js
```

## What it does

1. **Authenticates** with WordPress using JWT
2. **Fetches** existing e-bike posts from WordPress
3. **Updates** existing posts with new data from `ebikes.json`
4. **Creates** new posts for e-bikes that don't exist in WordPress yet

## Important Notes

- The script matches e-bikes by title (`Brand Model Name`)
- It updates all ACF (Advanced Custom Fields) with the latest data
- Includes image URLs, specifications, colors, highlights, etc.
- Runs with a 300ms delay between requests to avoid overwhelming the server

## Before Pushing to GitHub

**Always run this script before committing changes to ensure WordPress is up to date:**

```bash
node scripts/sync-to-wordpress.js
```

Then commit and push your changes.


