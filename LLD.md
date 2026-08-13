# LLD — Low Level Design

This document provides implementation details useful for future contributors or automation agents.

- Server endpoints (see API.md) and expected request/response shapes.
- Prisma schema located at server/prisma/schema.prisma — canonical DB model.
- Image storage: data/uploads/consultation/{consultationId}/{filename}
- Authentication: JWT signed with server/.env JWT_SECRET, expires in 8h for dev.
- Seed: server/prisma/seed.ts creates demo users and profiles.

Development notes:
- Keep secrets out of the repo. server/.env is used for local config.
- Use prisma migrate dev to create schema and prisma db seed to populate demo data.
