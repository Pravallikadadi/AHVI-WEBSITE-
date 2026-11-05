#!/usr/bin/env bash
# Builds the site, starts a mock Appwrite + the production server, and runs the popup E2E test.
set -euo pipefail
cd "$(dirname "$0")/.."
MOCK_PORT=${MOCK_PORT:-4010}; SITE_PORT=${SITE_PORT:-3100}
export APPWRITE_ENDPOINT="http://127.0.0.1:${MOCK_PORT}/v1" APPWRITE_PROJECT_ID=test APPWRITE_API_KEY=test-key
export ADMIN_PASSWORD=admin-test-pass ADMIN_SESSION_SECRET=test-secret-test-secret-test-secret
export NEXT_PUBLIC_APP_URL="http://localhost:${SITE_PORT}"
[ -d .next ] && [ -z "${SKIP_BUILD:-}" ] && rm -rf .next
[ -z "${SKIP_BUILD:-}" ] && npx next build
node scripts/mock-appwrite.mjs "$MOCK_PORT" & MOCK=$!
node node_modules/next/dist/bin/next start -p "$SITE_PORT" > /tmp/auth-e2e-next.log 2>&1 & SITE=$!
trap 'kill $MOCK $SITE 2>/dev/null || true; pkill -f "next-server" 2>/dev/null || true' EXIT
for i in $(seq 1 40); do curl -sf "http://localhost:${SITE_PORT}/api/user/session" >/dev/null && break; sleep 1; done
mkdir -p "${SHOTS_DIR:-/tmp/auth-shots}"
SITE_URL="http://localhost:${SITE_PORT}" MOCK_PORT="$MOCK_PORT" node scripts/test-auth-popup.mjs
