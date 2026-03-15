#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-}"
REGION="${REGION:-asia-south1}"
REPO_NAME="${REPO_NAME:-pet-curated-museum}"
SERVICE_NAME="${SERVICE_NAME:-pet-curated-museum-api}"
DELETE_IMAGES="${DELETE_IMAGES:-false}"
DELETE_REPOSITORY="${DELETE_REPOSITORY:-false}"

if [[ -z "${PROJECT_ID}" ]]; then
  echo "ERROR: PROJECT_ID is required"
  echo 'Example: PROJECT_ID="gen-lang-client-0956985642" ./scripts/destroy_cloud_run.sh'
  exit 1
fi

gcloud config set project "${PROJECT_ID}"

echo "Deleting Cloud Run service: ${SERVICE_NAME}"
gcloud run services delete "${SERVICE_NAME}" \
  --region "${REGION}" \
  --platform managed \
  --quiet || true

if [[ "${DELETE_IMAGES}" == "true" ]]; then
  IMAGE_PATH="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}"
  echo "Looking for images under: ${IMAGE_PATH}"

  gcloud artifacts docker images list "${IMAGE_PATH}" \
    --include-tags \
    --format="get(VERSION)" | while read -r version; do
      if [[ -n "${version}" ]]; then
        echo "Deleting image: ${version}"
        gcloud artifacts docker images delete "${version}" --quiet --delete-tags || true
      fi
    done
fi

if [[ "${DELETE_REPOSITORY}" == "true" ]]; then
  echo "Deleting Artifact Registry repository: ${REPO_NAME}"
  gcloud artifacts repositories delete "${REPO_NAME}" \
    --location="${REGION}" \
    --quiet || true
fi

echo "Teardown complete."
