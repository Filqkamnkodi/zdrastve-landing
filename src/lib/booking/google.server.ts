import { SignJWT, importPKCS8 } from "jose";
import { TIMEZONE } from "@/data/booking";
import type { Busy } from "./slots";

const API = "https://www.googleapis.com/calendar/v3";
let cached: { token: string; exp: number } | null = null;

export type GoogleCreds = { email: string; privateKey: string };

export function readCreds(): GoogleCreds | null {
  const email = process.env["GOOGLE_SERVICE_ACCOUNT_EMAIL"];
  let key = process.env["GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY"];
  if (!email || !key) return null;
  key = key.trim().replace(/^"|"$/g, "").replace(/\\n/g, "\n");
  if (!key.startsWith("-----BEGIN PRIVATE KEY-----")) {
    console.error("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY has an unexpected format");
    return null;
  }
  return { email, privateKey: key };
}

async function accessToken(c: GoogleCreds) {
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.exp - 60 > now) return cached.token;
  const pk = await importPKCS8(c.privateKey, "RS256");
  const assertion = await new SignJWT({ scope: "https://www.googleapis.com/auth/calendar" })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(c.email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(pk);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!res.ok) throw new Error(`Google token error [${res.status}]: ${await res.text()}`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: j.access_token, exp: now + Math.min(j.expires_in, 3300) };
  return j.access_token;
}

export async function freeBusy(c: GoogleCreds, calendarIds: string[], from: number, to: number) {
  const token = await accessToken(c);
  const res = await fetch(`${API}/freeBusy`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      timeMin: new Date(from).toISOString(),
      timeMax: new Date(to).toISOString(),
      timeZone: TIMEZONE,
      items: calendarIds.map((id) => ({ id })),
    }),
  });
  if (!res.ok) throw new Error(`Google freeBusy error [${res.status}]: ${await res.text()}`);
  const j = (await res.json()) as {
    calendars: Record<string, { busy?: { start: string; end: string }[]; errors?: unknown[] }>;
  };
  const out: Record<string, Busy[]> = {};
  for (const id of calendarIds) {
    const cal = j.calendars[id];
    if (!cal || cal.errors?.length) throw new Error(`Google freeBusy calendar error for ${id}: ${JSON.stringify(cal?.errors)}`);
    out[id] = (cal.busy ?? []).map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }));
  }
  return out;
}

export async function insertEvent(
  c: GoogleCreds,
  calendarId: string,
  ev: { summary: string; description: string; location: string; start: number; end: number },
) {
  const token = await accessToken(c);
  const res = await fetch(`${API}/calendars/${encodeURIComponent(calendarId)}/events`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: ev.summary,
      description: ev.description,
      location: ev.location,
      start: { dateTime: new Date(ev.start).toISOString(), timeZone: TIMEZONE },
      end: { dateTime: new Date(ev.end).toISOString(), timeZone: TIMEZONE },
    }),
  });
  if (!res.ok) throw new Error(`Google insert error [${res.status}]: ${await res.text()}`);
  return (await res.json()) as { id: string };
}
