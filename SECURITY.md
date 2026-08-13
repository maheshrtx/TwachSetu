# SECURITY.md

Security notes for TwachaSetu MVP:

- Secrets: Keep JWT_SECRET and any other secrets out of source control. Use server/.env locally and change values before sharing.
- Passwords: Seed uses bcrypt to hash demo passwords; never store plain-text passwords.
- Access control: Role-based checks are enforced server-side. Clients must send Authorization: Bearer <token>.
- File access: Uploaded files are served from /uploads; consider access restrictions if needed.
- No PHI export: This MVP runs locally; do not sync health data to external services without consent and compliance.
