# Virtual Mehfil

Modern community chat and video calling app. Built with React + Vite on the frontend and Node.js/Express on the backend. Uses Clerk for auth, Stream for chat and video, MongoDB for persistence, Inngest for background tasks, and Sentry for monitoring.

## Highlights

-   Authentication with Clerk (React + Express middlewares)
-   Real‑time chat via Stream Chat (channels, DMs, pinned messages, invites)
-   Public/private channels; “discoverable” public channels appear to everyone
-   Auto‑join new users to existing public channels (server + client fallback)
-   Video calls via Stream Video React SDK
-   Clean React 19 app using Vite 7, Tailwind CSS v4, TanStack Query
-   Error monitoring with Sentry; background jobs with Inngest

## Monorepo structure

```
Virtual_Mehfil/
├─ backend/               # Express API + Inngest + Stream server client
│  ├─ src/
│  │  ├─ config/          # env, db, inngest, stream
│  │  ├─ controllers/     # chat controller
│  │  ├─ middleware/      # auth guard (Clerk)
│  │  ├─ models/          # Mongoose models
│  │  ├─ routes/          # /api/chat endpoints
│  │  └─ server.js        # Express app entry
│  ├─ vercel.json         # Vercel functions config for backend
│  └─ package.json
├─ frontend/              # React + Vite app
│  ├─ src/
│  │  ├─ components/      # UI and Stream components
│  │  ├─ hooks/           # Custom hooks (useStreamChat, use-mobile)
│  │  ├─ lib/             # axios instance + API helpers
│  │  ├─ pages/           # Auth, Home (Chat), Call page
│  │  └─ providers/       # AuthProvider wiring Clerk token to axios
│  ├─ vercel.json         # Vite SPA rewrites
│  └─ package.json
└─ README.md              # You are here
```

## Architecture overview

-   Frontend (Vite + React 19)

    -   ClerkProvider wraps the app; user sessions available via `@clerk/clerk-react`.
    -   `useStreamChat` connects the logged in user to Stream Chat using a server‑issued token, then triggers a “public channels sync” so they are added to all discoverable channels.
    -   Chat UI powered by `stream-chat-react`. Video calls powered by `@stream-io/video-react-sdk` (see `CallPage.jsx`).
    -   Data fetching and caching via TanStack Query. Styling via Tailwind CSS v4.

-   Backend (Express)
    -   Auth middleware from `@clerk/express` attaches `req.auth()`.
    -   `/api/chat/token` returns a Stream token for the current user.
    -   `/api/chat/sync-public-channels` adds the current user to all discoverable “messaging” channels (idempotent).
    -   Stream server client (API key + secret) performs privileged operations (create token, add members).
    -   MongoDB via Mongoose for storing users; Inngest function listens to `clerk/user.created` to upsert Stream users and auto‑join them to public channels on signup.
    -   Sentry instrumentation for server errors.

## Requirements

-   Node.js 18+ (recommended LTS)
-   A MongoDB connection string
-   Clerk application (publishable + secret keys)
-   Stream Chat/Video API key and secret
-   Sentry DSN (optional but recommended)
-   Inngest project (for background user sync; optional as client fallback exists)

## Environment variables

Create two `.env` files—one under `backend/` and one under `frontend/`.

Backend (`backend/.env`):

```
PORT=5001
NODE_ENV=development
MONGO_URI=<your_mongodb_uri>

# Clerk (server)
CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
CLERK_SECRET_KEY=<your_clerk_secret_key>

# Stream (server)
STREAM_API_KEY=<your_stream_api_key>
STREAM_API_SECRET=<your_stream_api_secret>

# Monitoring
SENTRY_DSN=<your_sentry_dsn>

# Inngest (optional for background jobs)
INNGEST_EVENTS_KEY=<your_inngest_events_key>
INNGEST_SIGNING_KEY=<your_inngest_signing_key>

# Frontend origin allowed by CORS
CLIENT_URL=http://localhost:5173
```

Frontend (`frontend/.env`):

```
VITE_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
VITE_STREAM_API_KEY=<your_stream_api_key>
VITE_SENTRY_DSN=<your_sentry_dsn>
VITE_API_BASE_URL=http://localhost:5001/api
```

Never commit real secrets. Use Vercel/hosted environment variables for deploys.

## Install & run locally

Backend:

```
cd backend
npm install
npm run dev
```

Frontend:

```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 and sign in with Clerk. The app will:

-   Request a Stream token from `GET /api/chat/token` (with your Clerk JWT in Authorization).
-   Connect the user to Stream Chat/Video.
-   Trigger `POST /api/chat/sync-public-channels` so the user is added to all discoverable channels.

## Core flows

-   Create public channels: Use the “Create Channel” UI; selecting Public sets `discoverable = true` so new users can be auto‑joined.
-   Direct messages: Initiated from the users list; creates one‑off channels.
-   Video call: Navigate to `/call/:id` to create or join a call with id `:id` (Stream Video SDK handles creation on first join).

## API (backend)

Base URL: `http://localhost:5001/api`

-   `GET /chat/token` → `{ token: string }`

    -   Auth: required (Clerk). Uses Stream server client to issue a JWT for the current user.

-   `POST /chat/sync-public-channels` → `{ success: true }`
    -   Auth: required (Clerk). Queries discoverable messaging channels and adds the user as a member. Safe to call multiple times.

## Deployment (Vercel)

This monorepo has Vercel configs for both apps.

-   Frontend (`frontend/vercel.json`): SPA rewrites to `/` so client routing works.
-   Backend (`backend/vercel.json`): Uses `@vercel/node` to run `src/server.js` as a serverless function; routes all paths to that entry.

Set environment variables in each Vercel project (frontend and backend). For the frontend, use `VITE_*` variables only.

## Troubleshooting

-   Vite build tried to import from backend

    -   Ensure frontend imports don’t reach into `backend/**`. The `useStreamChat` hook lives under `frontend/src/hooks/useStreamChat.js`.

-   New users don’t see existing channels

    -   Ensure channels you want auto‑join enabled are created with `discoverable = true` (public). The backend `sync-public-channels` endpoint adds members only to discoverable messaging channels.
    -   The client calls the sync endpoint on connect; background Inngest also adds users on signup if configured.

-   401 from `/api/chat/token`

    -   Confirm Clerk is correctly configured on both frontend and backend; the frontend `AuthProvider` attaches the Clerk token to axios requests.

-   CORS errors
    -   Set `CLIENT_URL` in backend `.env` to your frontend origin. In production, set it to your deployed frontend URL.

## Scripts

Backend:

-   `npm run dev` — Start Express with nodemon & Sentry instrumentation
-   `npm start` — Start Express in production mode

Frontend:

-   `npm run dev` — Vite dev server
-   `npm run build` — Production build
-   `npm run preview` — Preview build locally

## Security notes

-   Keep server secrets out of the frontend (`VITE_*` envs are public at build time).
-   Rotate keys if any secrets were committed during development.

## License

MIT — see LICENSE (or choose an appropriate license for your project).
