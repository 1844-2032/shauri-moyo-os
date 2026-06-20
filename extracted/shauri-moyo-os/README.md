# Shauri Moyo SDA Church — Website (Next.js)

This is a real, working Next.js project — not a static mockup. It builds and
deploys like any production website.

## What's inside
- 5 pages: Home, About, Give, Request a Meeting, Resources
- The Sabbath countdown is live JavaScript (updates every second)
- Forms are visual only for now — they don't send data anywhere yet (that's
  the next phase, once a database is connected)
- Design tokens (green/gold palette, Fraunces + Work Sans fonts) are wired
  into Tailwind, matching the approved mockup exactly

## How to deploy this — no terminal required

### Step 1 — Get it onto GitHub
1. Go to github.com and log in (or create a free account)
2. Click the "+" icon top right → "New repository"
3. Name it `shauri-moyo-os`, leave it public or private, click "Create repository"
4. On the next page, click "uploading an existing file"
5. Drag the entire contents of this folder into the upload box (all files
   and folders — app/, components/, package.json, etc.)
6. Scroll down, click "Commit changes"

### Step 2 — Deploy it on Vercel
1. Go to vercel.com and sign up using your GitHub account (one click)
2. Click "Add New" → "Project"
3. Find `shauri-moyo-os` in the list and click "Import"
4. Vercel will auto-detect it's a Next.js project — leave all settings
   as default
5. Click "Deploy"
6. Wait about a minute — you'll get a live URL like
   `shauri-moyo-os.vercel.app` that you can open on any device or share
   with anyone

That's it — no command line needed for either step. From here on, any
time you (or I, via Claude Code) push updated code to GitHub, Vercel
automatically redeploys the live site.

## What's next (needs actual development work)
- Connect a real database (Supabase) so forms actually save data
- Add payment processing (M-Pesa, card)
- Add login and role-based dashboards (Pastor, Treasurer, Elders, etc.)

See the project blueprint (D-007) and Claude Code handoff guide (D-008)
for the full plan on these next steps.
