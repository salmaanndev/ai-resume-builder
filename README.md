# AI-Resume Builder

A full-stack MERN application with TypeScript that helps you create professional resumes powered by AI.

## Tech Stack

- **MongoDB** — Database for resumes
- **Express.js** — REST API backend (TypeScript)
- **React** — Frontend UI (TypeScript + Vite)
- **Node.js** — Server runtime
- **OpenRouter API** — AI resume generation and content improvement (supports free models)
- **Tailwind CSS** — Styling

## Features

- Create, edit, and delete resumes (no login required)
- AI-powered resume generation from job title
- AI content improvement for summaries and experience
- AI skill suggestions
- Live resume preview with print/PDF export
- Responsive, modern UI

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string
- [OpenRouter API key](https://openrouter.ai/) (optional, for AI features)

## Getting Started

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

Copy the example env file and update values:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-resume-builder
OPENROUTER_API_KEY=your-openrouter-api-key-here
OPENROUTER_MODEL=cohere/north-mini-code:free
CLIENT_URL=http://localhost:5173
```

### 3. Start MongoDB

Make sure MongoDB is running on your machine, or use a MongoDB Atlas URI in `MONGODB_URI`.

### 4. Run the app

```bash
npm run dev
```

This starts both servers concurrently:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## Project Structure

```
ai-resume-builder/
├── client/                 # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── types/         # TypeScript interfaces
│   └── package.json
├── server/                 # Express backend (TypeScript)
│   ├── src/
│   │   ├── config/        # Database & OpenRouter config
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   └── types/         # TypeScript interfaces
│   └── package.json
└── package.json            # Root scripts
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resumes` | List all resumes |
| POST | `/api/resumes` | Create a resume |
| GET | `/api/resumes/:id` | Get a resume |
| PUT | `/api/resumes/:id` | Update a resume |
| DELETE | `/api/resumes/:id` | Delete a resume |
| POST | `/api/ai/generate` | AI generate resume |
| POST | `/api/ai/improve` | AI improve content |
| POST | `/api/ai/suggest-skills` | AI suggest skills |

## License

MIT
