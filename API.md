# API Documentation

Base URL: http://localhost:4000/api

Auth
- POST /auth/login
  - { email, password }
  - Returns: { token, user }
- GET /auth/me
  - Auth required. Returns user profile.

Consultations
- POST /consultations (PATIENT)
  - Create a draft consultation. Body: { chiefConcern, description }
- POST /consultations/:id/submit (PATIENT)
  - Submit a consultation for doctor review.
- GET /consultations
  - Doctor: lists SUBMITTED/ASSIGNED; Patient: lists own consultations; Admin: all.
- GET /consultations/:id
  - Returns consultation with images and related data.
- POST /consultations/:id/images
  - multipart/form-data files under key 'images'. Persists ClinicalImage records.
- POST /consultations/:id/assign (DOCTOR)
  - Claim a consultation.
- POST /consultations/:id/complete (DOCTOR)
  - Mark as completed.

Evidence
- GET /evidence
  - Returns evidence items.

Health
- GET /health
  - { status: 'ok' }
