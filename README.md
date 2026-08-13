# TwachaSetu™ — 10-day MVP (local scaffold)

Quick start (recommended)
1. Ensure Node.js 18+ and npm are installed.
2. Copy this scaffold into a folder, or git init and add files.
3. From project root:
   npm install
4. Initialize DB & seed:
   cd server
   npx prisma migrate dev --name init --schema=prisma/schema.prisma
   npx prisma db seed --schema=prisma/schema.prisma
5. Run dev servers:
   # Option A: start both from root (requires concurrently)
   npm run dev
   # Option B: start separately
   npm run dev:server
   npm run dev:client

Health check
- Backend: http://localhost:4000/api/health -> { "status": "ok" }
- Frontend: http://localhost:5173/

Data & uploads
- SQLite DB: data/database.sqlite (managed by Prisma)
- Uploads: data/uploads/consultation/...

Notes
- This is an offline-first MVP scaffold. No cloud services are used.
- The seed creates one demo Patient, Doctor, and Admin. Use seed output for credentials.
- See server/prisma/seed.ts for demo account details.
