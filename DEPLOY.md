# Deployment Guide

This document covers deployment automation for:
- Backend on Google Cloud Run
- Frontend on Firebase Hosting

## Current deployed resources

- Firebase project: `gen-lang-client-0956985642`
- Cloud Run service: `pet-curated-museum-api`
- Live frontend: `https://gen-lang-client-0956985642.firebaseapp.com/`

## Why this matters

This repository includes script-based cloud deployment automation in the public repo.

Deployment automation files:
- `scripts/deploy_cloud_run.sh`
- `scripts/destroy_cloud_run.sh`
- `scripts/deploy_firebase_hosting.sh`
- `scripts/deploy_firebase_preview.sh`
- `scripts/disable_firebase_hosting.sh`

These scripts are included to demonstrate automated cloud deployment for both the backend and frontend.

## Prerequisites

Make sure these are installed and authenticated:
- Google Cloud SDK
- Firebase CLI
- Node.js and npm
- Python 3.x

```bash
gcloud auth login
firebase login
```

## Backend deployment automation

### Deploy backend to Cloud Run

```bash
PROJECT_ID="gen-lang-client-0956985642" ./scripts/deploy_cloud_run.sh
```

What this script does:
- Sets the active Google Cloud project
- Ensures the Artifact Registry repository exists
- Enables required Google Cloud services
- Builds the backend container image
- Pushes the image to Artifact Registry
- Deploys the service to Cloud Run

### Destroy backend deployment

```bash
PROJECT_ID="gen-lang-client-0956985642" ./scripts/destroy_cloud_run.sh
```

Optional cleanup:
```bash
PROJECT_ID="gen-lang-client-0956985642" DELETE_IMAGES=true DELETE_REPOSITORY=true ./scripts/destroy_cloud_run.sh
```

What this script does:
- Deletes the Cloud Run service
- Optionally deletes container images
- Optionally deletes the Artifact Registry repository

## Frontend deployment automation

### Deploy frontend to Firebase Hosting

```bash
PROJECT_ID="gen-lang-client-0956985642" ./scripts/deploy_firebase_hosting.sh
```

What this script does:
- Selects the Firebase project
- Installs frontend dependencies
- Builds the frontend
- Deploys the site to Firebase Hosting

### Deploy a preview channel

```bash
PROJECT_ID="gen-lang-client-0956985642" ./scripts/deploy_firebase_preview.sh
```

Optional custom preview settings:
```bash
PROJECT_ID="gen-lang-client-0956985642" CHANNEL_ID="judge-preview" EXPIRES="7d" ./scripts/deploy_firebase_preview.sh
```

What this script does:
- Builds the frontend
- Deploys the site to a Firebase Hosting preview channel
- Returns a shareable preview URL

### Disable live Firebase Hosting

```bash
PROJECT_ID="gen-lang-client-0956985642" ./scripts/disable_firebase_hosting.sh
```

What this script does:
- Disables the currently served Firebase Hosting site for the active project

## Manual environment configuration

### Frontend

Create `frontend/.env.local` with:

```text
VITE_API_BASE_URL=PASTE_YOUR_CLOUD_RUN_URL_HERE
```

### Backend

Set your Gemini API key before backend deployment:

```bash
export GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
```

## Verification

### Backend

Health check:
```bash
curl "$CLOUD_RUN_URL/health"
```

Interleaved exhibit endpoint:
```bash
curl -X POST "$CLOUD_RUN_URL/api/exhibit/interleaved" \
  -F "pet_photo=@/path/to/pet_photo.jpeg" \
  -F "day_photos=@/path/to/day_photo_1.jpeg" \
  -F "day_photos=@/path/to/day_photo_2.jpeg" \
  -F "day_photos=@/path/to/day_photo_3.jpeg"
```

### Frontend

- Open the deployed Firebase Hosting URL
- Upload 1 pet photo
- Upload 3 to 5 day photos
- Generate an exhibit
- Verify that artifact cards render successfully

## Proof for judges

This repository proves automated cloud deployment through public deployment scripts for:
- Google Cloud Run backend deployment
- Firebase Hosting frontend deployment

Google Cloud deployment proof video:
- https://youtu.be/Nht0PX_IHok