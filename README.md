# PARKpilot — Frontend

Smart parking reservation web app (user + admin). React 19 + TanStack Start + TypeScript + Tailwind CSS.

## Development

Requires Node.js and npm.

```sh
npm install
npm run dev
```

The dev server runs on **http://localhost:5173**.

The backend (Spring Boot) runs separately on **http://localhost:8080**.
Set `VITE_API_URL` to override the API base URL (defaults to `http://localhost:8080/api/v1`).

## Build

```sh
npm run build
npm run preview
```

## Tech stack
- TanStack Start (router + SSR)
- React 19 + TypeScript
- Tailwind CSS v4
- TanStack Query (data fetching)
- Radix UI + Framer Motion
