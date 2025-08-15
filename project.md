# Independence Day Photo Project

This is a full-stack web application built with Next.js and Flask that allows users to add tricolor overlays to their photos for Independence Day celebrations.

## Project Structure

```
independence_day_proj/
├── frontend/              # Next.js frontend
│   ├── src/              # Source code
│   ├── public/           # Static files
│   ├── package.json
│   └── .env.local        # Environment variables
├── backend/              # Flask backend
│   ├── app.py            # Main application
│   ├── utils/            # Utility functions
│   └── requirements.txt  # Python dependencies
└── vercel.json           # Vercel deployment config
```

## Features

- Upload photos
- Apply tricolor overlay with Ashoka Chakra
- Interactive UI with confetti effects
- Mini game: Catch the Tricolor
- Download processed photos

## Local Development

1. Start the backend:
```bash
cd backend
pip install -r requirements.txt
python app.py
```

2. Start the frontend:
```bash
cd frontend
npm install
npm run dev
```

## Deployment

The project is configured for deployment on Vercel:

1. Make sure you have the Vercel CLI installed:
```bash
npm install -g vercel
```

2. Deploy from the project root:
```bash
vercel
```

The deployment configuration in `vercel.json` handles both the frontend and backend:
- Frontend (Next.js) is served from the root path
- Backend (Flask) is served from the `/api` path

Note: On Vercel, the backend Python packages use `opencv-python-headless` instead of `opencv-python` for serverless compatibility.

## Environment Variables

Frontend (`.env.local`):
- `NEXT_PUBLIC_API_URL`: API endpoint ('/api' in production)

## Tech Stack

- Frontend:
  - Next.js
  - React
  - CSS Modules
  - Axios

- Backend:
  - Flask
  - OpenCV
  - Pillow
  - Flask-CORS
