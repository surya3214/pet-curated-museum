#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-gen-lang-client-0956985642}"

if ! command -v firebase >/dev/null 2>&1; then
  echo "ERROR: firebase CLI is not installed"
  echo "Install it with: npm install -g firebase-tools"
  exit 1
fi

echo "Using:"
echo "  PROJECT_ID = ${PROJECT_ID}"

firebase hosting:disable --project "${PROJECT_ID}" --force

echo "Done."
echo "Firebase Hosting has been disabled."