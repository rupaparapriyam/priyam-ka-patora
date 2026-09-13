/**
 * Priyuum chat proxy — Cloudflare Worker.
 *
 * Why this exists: a browser cannot hold a secret. Any key shipped in app.js is
 * readable by every visitor, so the key lives HERE instead, as an encrypted
 * Worker secret, and the browser only ever talks to this endpoint.
 *
 * Deploy:
 *   1. npm i -g wrangler && wrangler login
 *   2. wrangler secret put GROQ_API_KEY      (paste the NEW rotated key)
 *   3. wrangler deploy
 *   4. Put the deployed URL into AI_PROXY_URL in portfolio/app.js
 *
 * Never commit a key to this file. `wrangler secret put` keeps it off disk.
 */

const ALLOWED_ORIGINS = [
  'https://priyamrupapara.com',
  'https://www.priyamrupapara.com',
  'http://127.0.0.1:4321',
];

const MODEL = 'llama-3.3-70b-versatile';
const MAX_MESSAGES = 12;
const MAX_CHARS = 4000;
const RATE_PER_MIN = 10;
const RATE_PER_DAY = 200;

function cors(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors(origin) },
  });

/** Per-IP limiter. Needs a KV namespace bound as RATE; without it, limits are skipped. */
async function limited(env, ip) {
  if (!env.RATE) return false;
  const minKey = `m:${ip}:${Math.floor(Date.now() / 60000)}`;
  const dayKey = `d:${ip}:${new Date().toISOString().slice(0, 10)}`;

  const [m, d] = await Promise.all([env.RATE.get(minKey), env.RATE.get(dayKey)]);
  if (Number(m || 0) >= RATE_PER_MIN || Number(d || 0) >= RATE_PER_DAY) return true;

  await Promise.all([
    env.RATE.put(minKey, String(Number(m || 0) + 1), { expirationTtl: 120 }),
    env.RATE.put(dayKey, String(Number(d || 0) + 1), { expirationTtl: 90000 }),
  ]);
  return false;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors(origin) });
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405, origin);
    if (!ALLOWED_ORIGINS.includes(origin)) return json({ error: 'Origin not allowed' }, 403, origin);
    if (!env.GROQ_API_KEY) return json({ error: 'Proxy not configured' }, 500, origin);

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (await limited(env, ip)) {
      return json({ error: 'Rate limit reached. Try again shortly.' }, 429, origin);
    }

    let body;
    try { body = await request.json(); }
    catch { return json({ error: 'Bad JSON' }, 400, origin); }

    const messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : null;
    if (!messages || !messages.length) return json({ error: 'messages[] required' }, 400, origin);

    const total = messages.reduce((n, m) => n + String(m.content || '').length, 0);
    if (total > MAX_CHARS) return json({ error: 'Payload too large' }, 413, origin);

    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: body.model || MODEL,
        messages,
        temperature: body.temperature ?? 0.9,
        max_tokens: 500,
      }),
    });

    if (!upstream.ok) {
      // Never surface the upstream body — it can echo key or account details.
      return json({ error: `Upstream error (${upstream.status})` }, 502, origin);
    }

    const data = await upstream.json();
    return json({ text: data.choices?.[0]?.message?.content ?? '' }, 200, origin);
  },
};
