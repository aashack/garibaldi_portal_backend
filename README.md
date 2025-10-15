# Garibaldi Portal Backend

Express + TypeScript + Prisma service that manages user profiles for the portal. It verifies JWT Bearer tokens issued by `garibaldi_login` and exposes endpoints to create, read, and update the current user's profile.

## Stack
- Express (TypeScript)
- Prisma + PostgreSQL
- JWT auth (shared `JWT_SECRET` with garibaldi_login)
- Dockerized with docker-compose

## Endpoints
- `GET /api/profile` — Return the authenticated user's profile
- `POST /api/profile` — Create a profile (409 if it already exists)
- `POST /api/profile/initialize` — Idempotent create of an empty profile (safe to call after registration)
- `PUT /api/profile` — Update fields: `firstName`, `lastName`, `country`, `city`, `region`

## Local Dev (Docker)
1. Start services:
   - From `garibaldi_portal_backend/`: `docker-compose up -d`
2. Run Prisma migrations and generate client:
   - `docker-compose exec garibaldi_portal_backend npx prisma migrate deploy`
   - `docker-compose exec garibaldi_portal_backend npx prisma generate`

Ensure `JWT_SECRET` matches the value used by `garibaldi_login` so tokens verify correctly.

## Environment
- `DATABASE_URL` — PostgreSQL connection string (set in docker-compose)
- `JWT_SECRET` — Must match `garibaldi_login`'s secret
- `PORT` — Default `3001`

## Registration Flow (recommended)
- Add a Register flow in your UI that calls `garibaldi_login` to create the user and returns a JWT.
- After registration succeeds (or after first login), call `POST /api/profile/initialize` with the JWT Bearer token to create the user's empty profile.

## Example cURL
```bash
# Create (if not existing)
curl -X POST http://localhost:3001/api/profile \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Ada","lastName":"Lovelace","country":"UK","city":"London","region":"London"}'

# Read
curl -X GET http://localhost:3001/api/profile \
  -H "Authorization: Bearer <JWT>"

# Update
curl -X PUT http://localhost:3001/api/profile \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"city":"Oxford"}'

# Initialize empty profile (idempotent)
curl -X POST http://localhost:3001/api/profile/initialize \
  -H "Authorization: Bearer <JWT>"
```

