# Railway Backend Deployment Design

## Goal

Deploy the Spring Boot API from this monorepo to Railway and connect the existing Vercel frontend to it.

## Acceptance criteria

- Railway builds only `backend/` and starts the Spring Boot application successfully.
- The server listens on Railway's injected `PORT`, with port `8082` retained for local development.
- Railway exposes a public HTTPS domain for the API.
- The Vite production bundle reads its API origin from `VITE_API_BASE_URL` and never falls back to localhost in production.
- CORS permits the deployed Vercel origin and local Vite development origins without using a credentialed wildcard.
- JWT signing configuration is supplied through environment configuration rather than a production secret committed to Git; a secure process-local key permits an immediate demo boot when the variable is absent.
- Backend tests and the frontend production build pass before deployment.

## Deployment approach

1. Set the Railway service root directory to `/backend`, the supported Railway configuration for an isolated monorepo.
2. Make Spring Boot deployment settings environment-driven (`PORT`, allowed origins, and JWT secret).
3. Add a container build definition as a reproducible fallback while keeping Railway's Java autodetection usable.
4. Generate a Railway public domain and verify a public API endpoint over HTTPS.
5. Set `VITE_API_BASE_URL` in Vercel to that domain and redeploy the frontend.

## Security checkpoint

- Authentication endpoints remain public; authorization behavior is not broadened as part of deployment work.
- CORS is restricted by configurable origins rather than `*` with credentials.
- No production credential is committed to the repository. A stable `JWT_SECRET` is recommended so sessions survive restarts.
- The H2 database is acceptable for this demo deployment but is ephemeral; persistent user data requires a managed database in a follow-up.
