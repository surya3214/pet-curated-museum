#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-gen-lang-client-0956985642}"
FRONTEND_DIR="${FRONTEND_DIR:-frontend}"

if ! command -v firebase >/dev/null 2>&1; then
  echo "ERROR: firebase CLI is not installed"
  echo "Install it with: npm install -g firebase-tools"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm is required"
  exit 1
fi

echo "Using:"
echo "  PROJECT_ID   = ${PROJECT_ID}"
echo "  FRONTEND_DIR = ${FRONTEND_DIR}"

firebase use "${PROJECT_ID}"

pushd "${FRONTEND_DIR}" >/dev/null
npm install
npm run build
popd >/dev/null

firebase deploy --only hosting --project "${PROJECT_ID}"

echo "Done."
echo "Firebase Hosting deploy completed."