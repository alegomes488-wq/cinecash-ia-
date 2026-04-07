// Minimal express server exposing a protected deploy endpoint (MVP).
// WARNING: This is a prototype. You MUST secure this endpoint (auth + CI hook) before enabling.

const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.json());

// Simple secret-based check. Set IA_DEPLOY_SECRET in env before running.
const SECRET = process.env.IA_DEPLOY_SECRET || 'change-this-secret';

function secureCompare(a, b) {
  const ah = crypto.createHash('sha256').update(a).digest();
  const bh = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ah, bh);
}

app.post('/api/deploy', (req, res) => {
  const token = req.headers['x-ia-deploy-token'];
  if (!token || !secureCompare(token, SECRET)) {
    return res.status(403).json({ ok: false, reason: 'forbidden' });
  }

  // Run deploy command securely on the server — adjust as needed.
  exec('bash scripts/deploy.sh', { cwd: process.cwd() }, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ ok: false, err: stderr || err.message });
    res.json({ ok: true, out: stdout });
  });
});

module.exports = app;
