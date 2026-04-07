Admin API (MVP)

This folder contains a minimal Express app exposing a protected `/api/deploy` endpoint.
DO NOT expose this to the public internet without proper authentication and hardening.

To run locally:
1. Install dependencies: `npm i express body-parser`
2. Set secret: `export IA_DEPLOY_SECRET=your-secret`
3. Start: `node server/admin_api.js` (wrap in a small runner to call `app.listen`)
