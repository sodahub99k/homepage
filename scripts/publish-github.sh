#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

META="$ROOT/.soda/meta.json"

if [[ ! -f "$META" ]]; then
  echo "error: .soda/meta.json not found" >&2
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "error: gh CLI is required (https://cli.github.com/)" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "error: jq is required" >&2
  exit 1
fi

OWNER="$(gh api user -q .login)"
FOLDER_NAME="$(basename "$ROOT")"

REMOTE_URL="$(git remote get-url origin 2>/dev/null || true)"
if [[ -n "$REMOTE_URL" ]]; then
  SLUG="$(echo "$REMOTE_URL" | sed -E 's#.*[:/]([^/]+)(\.git)?$#\1#')"
else
  SLUG="$FOLDER_NAME"
fi

if [[ "$SLUG" != "$FOLDER_NAME" ]]; then
  echo "error: folder name '$FOLDER_NAME' does not match repo slug '$SLUG'" >&2
  exit 1
fi

TITLE="$(jq -r '.title' "$META")"
DESCRIPTION="$(jq -r '.description' "$META")"
TOPICS="$(jq -c '.topics' "$META")"
DEMO_URL="https://${OWNER}.github.io/${SLUG}/"

echo "→ owner: $OWNER"
echo "→ slug:  $SLUG"

if gh repo view "$OWNER/$SLUG" >/dev/null 2>&1; then
  echo "→ repo already exists, pushing..."
else
  echo "→ creating public repo $OWNER/$SLUG"
  gh repo create "$SLUG" --public --source=. --remote=origin --push
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "https://github.com/$OWNER/$SLUG.git"
fi

git push -u origin HEAD:main 2>/dev/null || git push -u origin main

echo "→ enabling GitHub Pages (workflow)"
gh api "repos/$OWNER/$SLUG/pages" \
  -X POST \
  -f build_type=workflow \
  2>/dev/null || \
gh api "repos/$OWNER/$SLUG/pages" \
  -X PUT \
  -f build_type=workflow

echo "→ updating About"
gh repo edit "$OWNER/$SLUG" \
  --description "$DESCRIPTION" \
  --homepage "$DEMO_URL"

echo "→ syncing topics from meta.json"
gh api "repos/$OWNER/$SLUG/topics" \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  --input - <<< "{\"names\": $TOPICS}"

echo ""
echo "✓ Published: https://github.com/$OWNER/$SLUG"
echo "  Demo URL:  $DEMO_URL"
echo "  Pages deploy will run via GitHub Actions."
