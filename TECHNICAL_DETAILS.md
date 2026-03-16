# Technical Details — Pet-Curated Museum of a Day

## Project Summary

Pet-Curated Museum of a Day is a multimodal storytelling app that turns a pet photo and a set of daily snapshots into a curated AI museum experience.  
The core concept is a pet-perspective narrator that interprets the user’s day as a sequence of museum artifacts, each with visual framing, exhibit text, and voice.

## Core Experience

- Users upload one pet image and multiple photos from their day
- The app commissions a personalized museum exhibit
- The backend generates structured interleaved artifact output
- Each artifact is rendered as a museum-style card in the frontend
- Narration is designed to match the same pet persona as the written exhibit text

## Architecture

- Frontend: React
- Frontend Hosting: Firebase Hosting
- Backend: Google Cloud Run
- Model/API Layer: Gemini via Google GenAI SDK
- Output Format: Custom interleaved exhibit prompt + normalization layer
- Data Layer: No database in the current MVP

## Request Flow

1. The user uploads a pet photo and a set of daily images in the web app
2. The frontend sends the request to the Cloud Run backend
3. The backend builds a multimodal prompt with the pet image and daily images in one shared context
4. Gemini generates structured museum-style output
5. The backend normalizes the response into renderable exhibit blocks
6. The frontend displays the resulting artifact cards and narration experience

## Why Gemini

This project depends on multimodal reasoning rather than plain captioning.  
The model needs to interpret multiple images together, maintain a consistent pet persona, and generate a cohesive exhibit-style narrative instead of isolated descriptions.  
That makes Gemini’s multimodal input and interleaved storytelling behavior central to the product.

## Prompting and Output Design

A custom prompt was created specifically for the museum format.  
The prompt instructs the model to behave like a dramatic, biased pet curator and generate artifact-style outputs with a coherent exhibit voice.  
A normalization layer is used after generation so the output can be rendered cleanly in the UI as structured exhibit blocks rather than raw free-form text.

## Deployment Notes

- Backend service is deployed on Google Cloud Run
- Frontend is deployed on Firebase Hosting
- The current Firebase project is: `gen-lang-client-0956985642`
- The Cloud Run service used for the backend is: `pet-curated-museum-api`

## Technical Decisions

### Single backend service
The MVP uses a single Cloud Run-hosted backend service to keep the architecture simple and fast to iterate on.

### No database
The current version does not require a database.  
The exhibit is generated from the uploaded images and returned directly for rendering.

### Persona consistency
All images are processed together in one context so the generated museum narrative feels unified and maintains the same pet voice throughout the experience.

### Narration direction
The experience is designed so narration reflects the same character persona as the written exhibit copy, improving cohesion across the interface.

## Judge Notes

This project is intentionally built as a product experience, not just a prompt demo.  
The main technical focus areas are:

- Multimodal input handling
- Interleaved storytelling output
- Persona-consistent generation
- Structured rendering of creative AI responses
- Lightweight Google Cloud deployment for a public demo

## Links

- Live Demo: https://gen-lang-client-0956985642.firebaseapp.com/
- GitHub Repository: https://github.com/surya3214/pet-curated-museum
- Google Cloud Deployment Proof: https://youtu.be/Nht0PX_IHok
