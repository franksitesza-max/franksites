/* global process */

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequestStore = new Map();

const sendJson = (res, status, body) => {
  res.status(status);
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return res.json(body);
};

const getClientIp = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return forwardedFor[0].trim();
  }

  return req.socket?.remoteAddress || "unknown";
};

const isRateLimited = (ipAddress) => {
  const now = Date.now();

  for (const [key, timestamps] of ipRequestStore.entries()) {
    const freshTimestamps = timestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
    if (freshTimestamps.length === 0) {
      ipRequestStore.delete(key);
      continue;
    }

    ipRequestStore.set(key, freshTimestamps);
  }

  const timestamps = ipRequestStore.get(ipAddress) || [];
  const freshTimestamps = timestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (freshTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestStore.set(ipAddress, freshTimestamps);
    return true;
  }

  freshTimestamps.push(now);
  ipRequestStore.set(ipAddress, freshTimestamps);
  return false;
};

const isAllowedOrigin = (origin, host) => {
  const configuredOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const allowList = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://franksites.co.za",
    "https://www.franksites.co.za",
    ...configuredOrigins,
  ]);

  if (!origin) {
    return true;
  }

  if (allowList.has(origin)) {
    return true;
  }

  try {
    const originUrl = new URL(origin);
    const normalizedHost = String(host || "").toLowerCase();
    const sameHost = originUrl.host.toLowerCase() === normalizedHost;

    if (
      sameHost &&
      (originUrl.protocol === "https:" ||
        normalizedHost === "localhost:5173" ||
        normalizedHost === "127.0.0.1:5173")
    ) {
      return true;
    }

    if (
      originUrl.protocol === "https:" &&
      originUrl.hostname.endsWith(".vercel.app") &&
      normalizedHost.endsWith(".vercel.app") &&
      sameHost
    ) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
};

const sanitizeLine = (value, maxLength) =>
  String(value || "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

const sanitizeBlock = (value, maxLength) =>
  String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim()
    .slice(0, maxLength);

const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { ok: false, message: "Method not allowed." });
  }

  const contentType = String(req.headers["content-type"] || "").toLowerCase();
  if (!contentType.includes("application/json")) {
    return sendJson(res, 415, { ok: false, message: "Unsupported content type." });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!isAllowedOrigin(origin, host)) {
    return sendJson(res, 403, { ok: false, message: "Origin not allowed." });
  }

  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    return sendJson(res, 429, {
      ok: false,
      message: "Too many enquiries from this connection. Please try again a little later.",
    });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL || "franksitesza@gmail.com";
  const contactFrom = process.env.CONTACT_FROM || "Frank Sites <onboarding@resend.dev>";

  if (!resendApiKey) {
    return sendJson(res, 500, {
      ok: false,
      message: "Contact form is not configured yet. Please email us directly for now.",
    });
  }

  const body =
    typeof req.body === "string"
      ? (() => {
          try {
            return JSON.parse(req.body);
          } catch {
            return null;
          }
        })()
      : req.body;

  if (!body || typeof body !== "object") {
    return sendJson(res, 400, { ok: false, message: "Invalid request body." });
  }

  const name = sanitizeLine(body.name, 120);
  const email = sanitizeLine(body.email, 160).toLowerCase();
  const business = sanitizeLine(body.business, 160);
  const message = sanitizeBlock(body.message, 3000);
  const website = sanitizeLine(body.website, 160);
  const formStartedAt = Number(body.formStartedAt || 0);
  const submittedAt = Date.now();

  if (website) {
    return sendJson(res, 200, { ok: true, message: "Thanks, your enquiry has been received." });
  }

  if (!name || !email || !message) {
    return sendJson(res, 400, { ok: false, message: "Please complete all required fields." });
  }

  if (message.length < 10) {
    return sendJson(res, 400, {
      ok: false,
      message: "Please add a little more detail so we can help properly.",
    });
  }

  if (!validEmail(email)) {
    return sendJson(res, 400, { ok: false, message: "Please enter a valid email address." });
  }

  if (!formStartedAt || submittedAt - formStartedAt < 2500) {
    return sendJson(res, 400, { ok: false, message: "Please try again in a moment." });
  }

  const escapedMessage = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");

  try {
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: contactFrom,
        to: [contactEmail],
        reply_to: email,
        subject: `New Frank Sites enquiry from ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Business: ${business || "Not provided"}`,
          "",
          "Project details:",
          message,
        ].join("\n"),
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1c1612;">
            <h2 style="margin: 0 0 16px;">New Frank Sites enquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Business:</strong> ${business || "Not provided"}</p>
            <p><strong>Project details:</strong></p>
            <p>${escapedMessage}</p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend error:", errorText);
      return sendJson(res, 502, {
        ok: false,
        message: "We could not send your enquiry just now. Please email us directly.",
      });
    }

    return sendJson(res, 200, { ok: true, message: "Thanks, your enquiry has been sent." });
  } catch (error) {
    console.error("Contact form request failed:", error);
    return sendJson(res, 500, {
      ok: false,
      message: "We could not send your enquiry just now. Please email us directly.",
    });
  }
}
