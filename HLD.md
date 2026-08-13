# TwachaSetu™ — High Level Design (HLD)

This HLD summarizes the architecture and core components for the TwachaSetu MVP.

- Architecture: Local three-layer architecture (Frontend UI, Application API, SQLite + local file storage).
- Frontend: React + TypeScript (Vite) with Tailwind for styling.
- Backend: Node.js + Express + TypeScript. JWT auth for offline local use.
- Database: SQLite managed by Prisma. Images stored on local filesystem under data/uploads.

Core modules:
- Authentication
- Patient management
- Consultation management
- Image management
- Evidence library
- Audit logging
- Admin

This document is a living artifact for future agents and developers.
