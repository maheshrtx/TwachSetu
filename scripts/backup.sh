#!/usr/bin/env bash
# scripts/backup.sh — simple local backup: copies database and uploads into a timestamped archive
set -e
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT_DIR/backups"
mkdir -p "$OUT_DIR"
TS=$(date -u +%Y%m%dT%H%M%SZ)
ARCHIVE="$OUT_DIR/twachasetu-backup-$TS.tar.gz"

echo "Creating backup: $ARCHIVE"
cd "$ROOT_DIR"
# include database and uploads
tar -czf "$ARCHIVE" data/database.sqlite data/uploads || true

echo "Backup saved to $ARCHIVE"
