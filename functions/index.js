const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const rateLimitStore = new Map();

function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.resetAt > 3600000) {
      rateLimitStore.delete(key);
    }
  }
}
setInterval(cleanupRateLimit, 300000);

exports.checkLoginRateLimit = functions.https.onCall(async (data, context) => {
  const ip = context.rawRequest.ip || 'unknown';
  const key = `login:${ip}`;
  const now = Date.now();
  
  const limit = 10;
  const windowMs = 15 * 60 * 1000;

  let record = rateLimitStore.get(key);
  if (!record || now - record.resetAt > windowMs) {
    record = { count: 0, resetAt: now + windowMs };
  }

  record.count++;
  rateLimitStore.set(key, record);

  if (record.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
      message: 'Too many login attempts. Please try again later.'
    };
  }

  return {
    allowed: true,
    remaining: limit - record.count,
    resetAt: record.resetAt
  };
});

exports.checkWithdrawalRateLimit = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const uid = context.auth.uid;
  const key = `withdraw:${uid}`;
  const now = Date.now();
  
  const limit = 3;
  const windowMs = 60 * 60 * 1000;

  let record = rateLimitStore.get(key);
  if (!record || now - record.resetAt > windowMs) {
    record = { count: 0, resetAt: now + windowMs };
  }

  record.count++;
  rateLimitStore.set(key, record);

  if (record.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
      message: 'Too many withdrawal requests. Please try again later.'
    };
  }

  return {
    allowed: true,
    remaining: limit - record.count,
    resetAt: record.resetAt
  };
});

exports.validateWithdrawal = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { amount, balance, videosWatched } = data;
  const minWithdrawal = 10;
  const minVideos = 5;

  if (amount < minWithdrawal) {
    return { valid: false, message: `Minimum withdrawal is R$ ${minWithdrawal}` };
  }

  if (amount > balance) {
    return { valid: false, message: 'Insufficient balance' };
  }

  if (videosWatched < minVideos) {
    return { valid: false, message: `Need at least ${minVideos} videos watched` };
  }

  return { valid: true };
});
