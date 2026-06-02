#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/ohcnetwork/care_fe.git"
REF="${1:-develop}"
TYPES_DIR="src/types"
VERSION_FILE=".types-sync-ver"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

# Temp dir with cleanup on exit
TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

echo "Fetching types from ohcnetwork/care_fe @ $REF ..."

# Shallow sparse clone — only src/types/
git clone --depth 1 --filter=blob:none --sparse --branch "$REF" \
  "$REPO_URL" "$TMPDIR/care_fe" --quiet 2>/dev/null

pushd "$TMPDIR/care_fe" > /dev/null
git sparse-checkout set "$TYPES_DIR"
FETCHED_HASH="$(git rev-parse HEAD)"
popd > /dev/null

# Check if already up to date
if [[ -f "$VERSION_FILE" ]]; then
  CURRENT_HASH="$(head -1 "$VERSION_FILE" | cut -d' ' -f2)"
  if [[ "$CURRENT_HASH" == "$FETCHED_HASH" ]]; then
    echo "Already up to date ($REF @ ${FETCHED_HASH:0:10})"
    exit 0
  fi
fi

# Warn if there are uncommitted local changes in src/types/
if ! git diff --quiet -- "$TYPES_DIR" 2>/dev/null || \
   ! git diff --cached --quiet -- "$TYPES_DIR" 2>/dev/null; then
  echo "Warning: You have uncommitted changes in $TYPES_DIR"
  if [[ -t 0 ]]; then
    read -rp "Overwrite local changes? [y/N] " answer
    if [[ ! "$answer" =~ ^[Yy]$ ]]; then
      echo "Aborted."
      exit 1
    fi
  else
    echo "Non-interactive mode — proceeding anyway."
  fi
fi

# Replace types
rm -rf "$TYPES_DIR"
cp -r "$TMPDIR/care_fe/$TYPES_DIR" "$TYPES_DIR"

# Write version file
cat > "$VERSION_FILE" <<EOF
commit $FETCHED_HASH
ref $REF
synced $(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

echo ""
echo "Synced types from $REF @ ${FETCHED_HASH:0:10}"
echo ""

# Show what changed
git diff --stat -- "$TYPES_DIR" 2>/dev/null || true
