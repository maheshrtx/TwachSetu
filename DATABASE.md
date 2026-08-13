# DATABASE.md

The project uses SQLite with Prisma ORM. The database file is located at:

  data/database.sqlite

Key models are defined in server/prisma/schema.prisma. Use the Prisma CLI to manage migrations:

  npx prisma generate
  npx prisma migrate dev --name init --schema=prisma/schema.prisma
  npx prisma db seed --schema=prisma/schema.prisma

Do not store large binary blobs inside the DB; store file paths and metadata instead.
