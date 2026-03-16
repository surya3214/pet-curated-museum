# Deployment Guide

This document covers deployment for:
- Backend on Google Cloud Run
- Frontend on Firebase Hosting

## Current deployed resources

- Firebase project: `gen-lang-client-0956985642`
- Cloud Run service: `pet-curated-museum-api`

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

## Backend deployment (Google Cloud Run)

### 1. Move to the backend directory

```bash
cd backend
```

### 2. Set environment variables

```bash
export PROJECT_ID="gen-lang-client-0956985642"
export REGION="asia-south1"
export SERVICE_NAME="pet-curated-museum-api"
export GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
```

### 3. Select the project

```bash
gcloud config set project "$PROJECT_ID"
```

### 4. Enable required services

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com
```

### 5. Deploy to Cloud Run

```bash
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=$GEMINI_API_KEY"
```

### 6. Save the backend URL

After deployment, copy the Cloud Run service URL and store it for the frontend configuration.

Example:

```bash
export CLOUD_RUN_URL="PASTE_THE_SERVICE_URL_HERE"
```

## Backend verification

### Health check

```bash
curl "$CLOUD_RUN_URL/health"
```

### Curate endpoint test

```bash
curl -X POST "$CLOUD_RUN_URL/api/exhibit/interleaved" \
  -F "pet_photo=@/path/to/pet_photo.jpeg" \
  -F "day_photos=@/path/to/day_photo_1.jpeg" \
  -F "day_photos=@/path/to/day_photo_2.jpeg" \
  -F "day_photos=@/path/to/day_photo_3.jpeg"
```

## Frontend deployment (Firebase Hosting)

### 1. Move to the frontend directory

```bash
cd frontend
```

### 2. Configure frontend environment

Create `frontend/.env.local` with:

```text
VITE_API_BASE_URL=PASTE_YOUR_CLOUD_RUN_URL_HERE
```

### 3. Install dependencies

```bash
npm install
```

### 4. Build the frontend

```bash
npm run build
```

### 5. Select the Firebase project

From the repo root:

```bash
firebase use gen-lang-client-0956985642
```

### 6. Deploy Hosting

From the repo root:

```bash
firebase deploy --only hosting
```

## Post-deploy verification

### Frontend

- Open the deployed Firebase Hosting URL
- Upload 1 pet photo
- Upload 3 to 5 day photos
- Generate an exhibit
- Verify that artifact cards render successfully

### Backend

- Confirm `/health` returns a success response
- Confirm `/api/exhibit/interleaved` accepts multipart form uploads
- Confirm Cloud Run logs show successful requests

## Troubleshooting

### Frontend cannot reach backend

- Verify `VITE_API_BASE_URL` points to the deployed Cloud Run service
- Rebuild the frontend after changing env values
- Redeploy Firebase Hosting

### Cloud Run deploy fails

- Verify billing and APIs are enabled
- Verify `GEMINI_API_KEY` is set
- Verify the active GCP project is correct

### API works locally but not in production

- Check Cloud Run logs
- Check request payload size and uploaded image formats
- Verify the deployed service URL is the one used by the frontend

## Proof of Google Cloud deployment

Use either of these as proof:
- Screen recording of the live app plus Cloud Run service logs
- Repository code links showing Google Cloud and Gemini integration

Current proof video:
- https://youtu.be/Nht0PX_IHok
```

Source values used above: Firebase-hosted frontend at `https://gen-lang-client-0956985642.firebaseapp.com/`, Cloud Run service `pet-curated-museum-api`, GitHub repo `https://github.com/surya3214/pet-curated-museum`, and Firebase project `gen-lang-client-0956985642`.