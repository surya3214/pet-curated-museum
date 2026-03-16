# Pet-Curated Museum of a Day

A web-first Creative Storyteller project where your pet becomes a hilariously biased museum curator of your day.

## Quick links

- Live Demo: https://gen-lang-client-0956985642.firebaseapp.com/
- Repository: https://github.com/surya3214/pet-curated-museum
- Deployment Guide: [DEPLOY.md](./DEPLOY.md)
- Google Cloud Deployment Proof: https://youtu.be/Nht0PX_IHok

## What it does

Upload:
- 1 pet photo
- 3 to 5 day photos

The app uses the pet portrait to derive a fictional curator persona, then turns the day photos into a narrated micro-museum exhibit with:
- curator persona summary
- exhibit title and subtitle
- styled artifact cards
- plaque text
- narrated audio guide
- subtitle segments for narration

## Why this exists

Most daily photos are forgettable. This project reframes them as artifacts in a tiny museum exhibit, narrated by the elevated and judgmental taste of your pet.

## Reproducible testing

Judges can test the project in either of these ways.

### Option 1: Test the live deployed app

1. Open the live demo: https://gen-lang-client-0956985642.firebaseapp.com/
2. Upload 1 pet photo
3. Upload 3 to 5 day photos
4. Click to generate or commission the exhibit
5. Wait for the exhibit to finish generating

Expected result:
- A pet curator persona is created from the uploaded pet image
- The app generates a museum-style exhibit from the day photos
- The UI renders structured artifact cards
- Each artifact includes exhibit text in the same pet persona
- The narration or playback experience matches the curator voice

### Option 2: Run locally

Follow the local setup below, then:

1. Open the frontend in the browser
2. Upload 1 pet photo and 3 to 5 day photos
3. Generate the exhibit
4. Verify that the artifact cards, text, and narration are returned successfully

## Current MVP scope

- Web-first experience
- Frontend + backend only
- Single multimodal Gemini call for narrative consistency
- No database
- Structured JSON response rendered as an exhibit

## Tech stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS

### Backend

- FastAPI
- Pydantic
- Gemini API

## Local setup

### 1. Clone the repo

```bash
git clone https://github.com/surya3214/pet-curated-museum.git
cd pet-curated-museum
```

### 2. Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export GEMINI_API_KEY="YOUR_API_KEY"
uvicorn main:app --reload --port 8000
```

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

### 4. Frontend env

Create `frontend/.env.local` with:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## API

### Health

`GET /health`

### Curate exhibit

`POST /api/exhibit/interleaved`

Form fields:
- `pet_photo`
- `day_photos` (3 to 5)
- `curator_name` (optional)
- `vibe_override` (optional)

## Example flow

- Upload one pet portrait
- Upload three to five day photos
- Generate the exhibit
- Read the artifact cards
- Play the curator narration

## Deployment

For full deployment instructions for both backend and frontend, see [DEPLOY.md](./DEPLOY.md).

That file includes:
- Google Cloud Run backend deployment
- Firebase Hosting frontend deployment
- Environment configuration
- Post-deploy verification steps

## Deployment automation

This repo includes public deployment scripts for both backend and frontend automation.

- Cloud Run backend deploy: `scripts/deploy_cloud_run.sh`
- Cloud Run backend teardown: `scripts/destroy_cloud_run.sh`
- Firebase Hosting deploy: `scripts/deploy_firebase_hosting.sh`
- Firebase Hosting preview deploy: `scripts/deploy_firebase_preview.sh`
- Firebase Hosting disable: `scripts/disable_firebase_hosting.sh`
