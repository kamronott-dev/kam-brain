#!/usr/bin/env bash
# One-shot GitHub Pages setup for Brain Map.
# Run this ONCE. After that, sync-to-github.sh keeps things up-to-date.
#
#   bash setup-github-pages.sh
#
# What it does:
#   1. Checks for git + gh (installs gh via Homebrew if missing)
#   2. Logs you into GitHub (one prompt)
#   3. Initializes the brain-map folder as a git repo
#   4. Creates a PRIVATE repo called "kam-brain" on your account
#   5. Pushes everything
#   6. Enables GitHub Pages
#   7. Prints your phone URL at the end

set -euo pipefail

REPO_DIR="$HOME/Desktop/Claude Files/Claude Apps/brain-map"
REPO_NAME="kam-brain"

cd "$REPO_DIR"

echo ""
echo "==> Step 1/7: Checking tools..."
if ! command -v git >/dev/null 2>&1; then
  echo "git not found. Install Xcode command-line tools first:"
  echo "    xcode-select --install"
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "gh (GitHub CLI) not found. Installing via Homebrew..."
  if ! command -v brew >/dev/null 2>&1; then
    echo "Homebrew not found. Install it from https://brew.sh first, then re-run this script."
    exit 1
  fi
  brew install gh
fi
echo "    git: $(git --version)"
echo "    gh:  $(gh --version | head -1)"

echo ""
echo "==> Step 2/7: GitHub login..."
if ! gh auth status >/dev/null 2>&1; then
  echo "You'll be prompted to log in. Choose:"
  echo "  - GitHub.com"
  echo "  - HTTPS"
  echo "  - Yes (authenticate Git)"
  echo "  - Login with a web browser"
  gh auth login
else
  echo "    Already logged in as: $(gh api user --jq .login)"
fi

GH_USER=$(gh api user --jq .login)

echo ""
echo "==> Step 3/7: Initializing git repo..."
if [[ ! -d .git ]]; then
  git init -b main >/dev/null
fi
cat > .gitignore <<'EOF'
pending/
.DS_Store
.skills/
EOF
echo "    Done."

echo ""
echo "==> Step 4/7: Creating private GitHub repo '$REPO_NAME'..."
if gh repo view "$GH_USER/$REPO_NAME" >/dev/null 2>&1; then
  echo "    Repo already exists. Skipping creation."
  if ! git remote get-url origin >/dev/null 2>&1; then
    git remote add origin "https://github.com/$GH_USER/$REPO_NAME.git"
  fi
else
  gh repo create "$REPO_NAME" --private --source=. --remote=origin
fi

echo ""
echo "==> Step 5/7: Committing + pushing files..."
git add -A
if ! git diff --cached --quiet; then
  git commit -m "Initial brain-map push" >/dev/null
fi
git push -u origin main

echo ""
echo "==> Step 6/7: Enabling GitHub Pages..."
gh api -X POST "repos/$GH_USER/$REPO_NAME/pages" \
  -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 || \
  echo "    (Pages may already be enabled — that's fine.)"

echo ""
echo "==> Step 7/7: Waiting for Pages to deploy (30-60 sec)..."
sleep 30
PAGES_URL=$(gh api "repos/$GH_USER/$REPO_NAME/pages" --jq .html_url 2>/dev/null || echo "")

echo ""
echo "============================================================"
echo "✓ DONE."
echo ""
if [[ -n "$PAGES_URL" ]]; then
  echo "Desktop URL:  ${PAGES_URL}brain-map.html"
  echo "Phone URL:    ${PAGES_URL}brain-mobile.html"
else
  echo "Pages URL:    https://${GH_USER}.github.io/${REPO_NAME}/"
  echo "Phone:        https://${GH_USER}.github.io/${REPO_NAME}/brain-mobile.html"
fi
echo ""
echo "Open the phone URL in iPhone Safari → Share → Add to Home Screen."
echo ""
echo "To push future updates, run:    bash sync-to-github.sh"
echo "(or wire it to a 5-min cron — see HOSTING.md)"
echo "============================================================"
