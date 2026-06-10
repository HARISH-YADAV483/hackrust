# TODO - Connect Frontend & Backend with Env Variables

- [x] Inspect frontend API base usage (`import.meta.env.VITE_API_URL`).
- [x] Inspect backend env usage (`process.env.*`) and CORS origin (`FRONTEND_URL`).
- [x] Update `render.yaml` to include backend `PORT=5001`.
- [x] Add `frontend/.env.example` with `VITE_API_URL` (including `/api`).
- [x] Add `backend/.env.example` with required variables (`PORT`, `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, external API keys).
- [x] Run frontend & backend locally with env vars and verify API calls + CORS. (manual step)
- [ ] (Optional) Add documentation to README about required env vars.


