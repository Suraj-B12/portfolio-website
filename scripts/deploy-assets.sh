#!/bin/bash
#
# Post-build static asset sync to S3.
#
# Run this from the site directory after `npm run build`. It pushes the
# contents of .next/static to s3://$BUCKET/_next/static, which is the path
# layout that Next.js assetPrefix expects when CloudFront fronts the bucket.
#
# Long Cache-Control is safe for /_next/static because every file name is
# content-hashed. Public assets get a shorter max-age because their names
# are stable and they are more likely to change in place.
#
# Requires the AWS CLI to be installed and configured (via IAM instance
# profile on EC2, or `aws configure` locally).

set -euo pipefail

BUCKET="${S3_ASSET_BUCKET:-}"

if [[ -z "${BUCKET}" ]]; then
  echo "S3_ASSET_BUCKET environment variable is not set." >&2
  echo "Example: export S3_ASSET_BUCKET=portfolio-static-assets" >&2
  exit 1
fi

if [[ ! -d ".next/static" ]]; then
  echo ".next/static not found. Run 'npm run build' first." >&2
  exit 1
fi

echo "Syncing .next/static to s3://${BUCKET}/_next/static ..."
aws s3 sync .next/static "s3://${BUCKET}/_next/static" \
  --delete \
  --cache-control "public, max-age=31536000, immutable"

echo "Syncing public/ to s3://${BUCKET}/ ..."
aws s3 sync public "s3://${BUCKET}/" \
  --cache-control "public, max-age=86400" \
  --exclude "*.md"

echo "Done."
