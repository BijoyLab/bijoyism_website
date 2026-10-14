import { products, channels } from '@/site/content';
import { validatePurchaseEvent } from '@/server/purchase-events.mjs';

const enabled = () => process.env.PURCHASE_ANALYTICS_ENABLED === 'true';
const options = { headers: { 'Cache-Control': 'no-store' } };
export async function GET() {
  return Response.json({ enabled: enabled() }, options);
}
export async function POST(request: Request) {
  if (!enabled()) return Response.json({ accepted: false }, { ...options, status: 503 });
  const origin = request.headers.get('origin');
  const requestOrigin = new URL(request.url);
  requestOrigin.host = request.headers.get('host') || requestOrigin.host;
  const allowed = new Set(['https://bijoyism.cc', 'https://bijoyism.cn', requestOrigin.origin]);
  if (!origin || !allowed.has(origin) || request.headers.get('sec-fetch-site') === 'cross-site') return Response.json({ accepted: false }, { ...options, status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ accepted: false }, { ...options, status: 415 });
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ accepted: false }, { ...options, status: 400 });
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    length += chunk.value.byteLength;
    if (length > 4096) { await reader.cancel(); return Response.json({ accepted: false }, { ...options, status: 413 }); }
    chunks.push(chunk.value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let value;
  try { value = JSON.parse(new TextDecoder().decode(bytes)); } catch { return Response.json({ accepted: false }, { ...options, status: 400 }); }
  const event = validatePurchaseEvent(value, products, channels);
  if (!event) return Response.json({ accepted: false }, { ...options, status: 400 });
  // Structured deployment logs; no raw IP, cookies, referrer URL, or query string.
  // Log retention/export is configured in hosting, not a fictitious local database.
  console.info(JSON.stringify({ type: 'bijoyism_purchase_click', receivedAt: new Date().toISOString(), ...event }));
  return Response.json({ accepted: true }, { ...options, status: 202 });
}
