# Pet-Curated Museum of a Day

A web-first Creative Storyteller project where your pet becomes a hilariously biased museum curator of your day.

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

## Current MVP scope

- Web-first experience
- Frontend + backend only
- Single multimodal Gemini call for narrative consistency
- No database
- Browser-native TTS
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
Create frontend/.env.local with:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## API
### Health
GET /health

### Curate exhibit
POST /api/v1/curate

Form fields:

pet_photo
day_photos (3 to 5)
curator_name (optional)
vibe_override (optional)

## Example flow
- Upload one pet portrait.
- Upload three to five day photos.
- Generate the exhibit.
- Read the artifact cards.
- Play the curator’s narration.