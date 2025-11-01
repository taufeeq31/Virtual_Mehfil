# Frontend (React + Vite)

This is the web client for Virtual Mehfil. For a full overview, environment variables, and backend/API details, see the repository root [`README.md`](../README.md).

## Quick start

```
npm install
npm run dev
```

Make sure `frontend/.env` is set (see root README). The app expects a running backend at `VITE_API_BASE_URL` for Stream tokens.

## Build

```
npm run build
npm run preview
```

## Notable libraries

-   Clerk (`@clerk/clerk-react`) for auth
-   Stream Chat (`stream-chat`, `stream-chat-react`) for messaging
-   Stream Video (`@stream-io/video-react-sdk`) for calls
-   TanStack Query for data fetching
-   Tailwind CSS v4 for styling
