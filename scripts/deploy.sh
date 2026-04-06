#!/usr/bin/env bash
# Minimal deploy helper
BRANCH=${1:-main}
echo "Staging all changes..."
git add -A
MSG="chore(deploy): deploy from IA Developer Hub - $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git commit -m "$MSG" || echo "No changes to commit"
git push origin HEAD:$BRANCH
echo "Done."
