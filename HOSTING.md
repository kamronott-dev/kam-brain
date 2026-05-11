# Hosting Brain Mobile so your phone can actually use it

Your phone can't reach into `~/Desktop/...` on your Mac. So the brain-map folder needs to live somewhere your phone can fetch over HTTPS. The recommended path is **GitHub Pages on a private repo**, with an auto-push script.

## Why GitHub Pages

- Free, fast, HTTPS by default.
- Private repos still serve Pages content (you control who has the URL).
- One-time setup, then it just works.
- Plays nicely with the existing scheduled-task system — auto-push every 5 min via cron.

## One-time setup (~20 min)

### 1. Create a private GitHub repo

You need a GitHub account and the `gh` CLI installed (`brew install gh` on Mac). Then:

```bash
cd ~/Desktop/Claude\ Files/Claude\ Apps/brain-map
bash sync-to-github.sh        # initializes the local git repo
gh auth login                  # if not already logged in
gh repo create kam-brain --private --source=. --remote=origin --push
```

This creates `github.com/<your-user>/kam-brain` as private, and pushes the brain-map files into it.

### 2. Enable GitHub Pages

```bash
# Enable Pages on the main branch, root folder
gh api -X POST "repos/<your-user>/kam-brain/pages" \
  -f source.branch=main -f source.path=/
```

(Or do it through the GitHub web UI: Settings → Pages → Source: main → / (root).)

GitHub will give you a URL like `https://<your-user>.github.io/kam-brain/`. Your mobile entry point is `<url>/brain-mobile.html`.

### 3. Bookmark on phone + "Add to Home Screen"

On iPhone: open Safari, paste the URL, tap Share → Add to Home Screen. The PWA meta tags make it look like a real app (no Safari chrome). Voice input still goes through the system keyboard mic — that's universal.

### 4. Wire auto-sync (recommended)

So you don't have to remember to push, schedule the sync to run every 5 minutes:

```bash
# Add to crontab:
(crontab -l 2>/dev/null; echo "*/5 * * * * cd $HOME/Desktop/Claude\ Files/Claude\ Apps/brain-map && bash sync-to-github.sh >/dev/null 2>&1") | crontab -
```

Or — better — register it as a Cowork scheduled task:

```
name: "Brain auto-sync to GitHub"
interval: 5 minutes
command: cd "$HOME/Desktop/Claude Files/Claude Apps/brain-map" && bash sync-to-github.sh
```

Either way: edits land on the phone within 5 minutes.

## Privacy notes

- The repo is **private**, but anyone with the GitHub Pages URL can read it. That URL is a long alphanumeric string by default, but treat it as a soft secret.
- For stricter privacy: use Cloudflare Pages with Access (free), which requires login. Slightly more setup; let me know if you want that path instead.
- Never put credentials, passwords, or auth tokens in `index.js` body fields (also documented in SKILL.md).

## What gets synced

- `brain-map.html`, `brain-mobile.html` — the apps
- `index.js`, `feed.js`, `questions.js` — the data
- `SKILL.md`, `README.md`, `HOSTING.md`, `sync-to-github.sh`
- `pending/` is **gitignored** — those payloads stay local, processed by Claude, and never leave your Mac.

## Two-way sync (future)

Right now this is one-way: Mac → Phone. Phone-captured facts come back via paste-into-Claude. If you want true two-way sync (phone POSTs directly, no paste step), the next step up is a tiny Cloudflare Worker + KV store. Ask when you're ready and I'll build it.
