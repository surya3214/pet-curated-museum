# Architecture

## Overview

The app has two parts:

- Frontend: upload flow, exhibit rendering, browser-native narration
- Backend: accepts images, sends one multimodal request to Gemini, validates structured JSON, returns exhibit data

## Request flow

1. User uploads 1 pet photo and 3-5 day photos
2. Frontend sends multipart form data to backend
3. Backend sends one multimodal request to Gemini
4. Gemini returns structured exhibit JSON
5. Backend validates response with Pydantic
6. Frontend renders the exhibit and narration UI

## Design decisions

- Single multimodal call for narrative consistency
- No database in v1
- Browser-native TTS first
- Simple web-first architecture
