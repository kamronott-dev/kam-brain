#!/usr/bin/env bash
# Brain Map → GitHub Pages sync
#
# Pushes the brain-map/ folder (which now lives in this directory) to a private
# GitHub repo so Kam's phone can load it via GitHub Pages.
#
# Run manually:
#   bash sync-to-github.sh
#
# Or wire into a scheduled task so it auto-pushes whenever anything changes:
#   See HOSTING.md for the scheduler config.
#
# One-time setup is documented in HOSTING.md.

set -euo pipefail

REPO_DIR="${BRAIN_REPO_DIR:-$HOME/Desktop/Claude Files/Claude Apps/brain-map}"
GIT_REMOTE="${BRAIN_GIT_REMOTE:-origin}"
GIT_BRANCH="${BRAIN_GIT_BRANCH:-main}"
COMMIT_MSG="${BRAIN_COMMIT_MSG:-brain: auto-sync $(date -u +%Y-%m-%dT%H:%M:%SZ)}"

cd "$REPO_DIR"

# Initialize repo if not already
if [[ ! -d .git ]]; then
  echo "No .git found — initializing fresh repo in $REPO_DIR"
  git init -b "$GIT_BRANCH"
  cat > .gitignore <<'EOF'
# Pending payloads are processed locally — don't sync into the world.
pending/
.DS_Store
EOF
  echo ""
  echo "Now set up the remote. Run:"
  echo "  cd \"$REPO_DIR\""
  echo "  gh repo create kam-brain --private --source=. --remote=origin --push"
  echo ""
  echo "Or, with a regular git remote:"
  echo "  git remote add origin git@github.com:<your-user>/kam-brain.git"
  echo "  git push -u origin $GIT_BRANCH"
  exit 0
fi

# Check if there's anything to commit
if [[ -z "$(git status --porcelain)" ]]; then
  echo "Nothing changed. Skipping."
  exit 0
fi

git add -A
git commit -m "$COMMIT_MSG"
git push "$GIT_REMOTE" "$GIT_BRANCH"
echo "✓ Synced to $GIT_REMOTE/$GIT_BRANCH"
