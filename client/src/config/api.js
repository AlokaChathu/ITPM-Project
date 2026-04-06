/**
 * Backend API base.
 * In dev, use same-origin paths so Vite proxies `/api` → Express (see vite.config.js).
 * That avoids CORS issues and lets httpOnly admin cookies work reliably (5173 vs 4000).
 * In production, set VITE_BACKEND_URL at build time to your API origin.
 */
export const API_BASE = import.meta.env.PROD
  ? (import.meta.env.VITE_BACKEND_URL &&
      String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
    "http://localhost:4000"
  : "";
