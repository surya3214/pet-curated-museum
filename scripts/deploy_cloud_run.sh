#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-}"
REGION="${REGION:-asia-south1}"
REPO_NAME="${REPO_NAME:-pet-curated-museum}"
SERVICE_NAME="${SERVICE_NAME:-pet-curated-museum-api}"
IMAGE_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:manual-$(date +%Y%m%d-%H%M%S)"

if [[ -z "${PROJECT_ID}" ]]; then
  echo "ERROR: PROJECT_ID is required"
  echo "Example:"
  echo "  PROJECT_ID=my-gcp-project ./scripts/deploy_cloud_run.sh"
  exit 1
fi

echo "Using:"
echo "  PROJECT_ID   = ${PROJECT_ID}"
echo "  REGION       = ${REGION}"
echo "  REPO_NAME    = ${REPO_NAME}"
echo "  SERVICE_NAME = ${SERVICE_NAME}"
echo "  IMAGE_URI    = ${IMAGE_URI}"

gcloud config set project "${PROJECT_ID}"

gcloud artifacts repositories describe "${REPO_NAME}" \
  --location="${REGION}" >/dev/null 2>&1 || \
gcloud artifacts repositories create "${REPO_NAME}" \
  --repository-format=docker \
  --location="${REGION}" \
  --description="Docker repository for Pet-Curated Museum"

gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

gcloud builds submit ./backend --tag "${IMAGE_URI}"

gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE_URI}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated

echo "Done."
echo "Service should be available in Cloud Run."
