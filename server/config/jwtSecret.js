/**
 * Single place for user JWT secret — strips accidental quotes from .env values.
 */
export const getUserJwtSecret = () => {
  const raw = process.env.JWT_SECRET || process.env.WT_SECRET || "";
  const trimmed = String(raw).trim().replace(/^['"]|['"]$/g, "");
  if (trimmed) return trimmed;
  const nodeEnv = String(process.env.NODE_ENV || "")
    .trim()
    .replace(/^['"]|['"]$/g, "");
  if (nodeEnv !== "production") {
    return "dev-only-change-me-in-production";
  }
  return "";
};

export const getAdminJwtSecret = () => {
  const raw = process.env.JWT_SECRET_ADMIN || "";
  const trimmed = String(raw).trim().replace(/^['"]|['"]$/g, "");
  if (trimmed) return trimmed;
  const nodeEnv = String(process.env.NODE_ENV || "")
    .trim()
    .replace(/^['"]|['"]$/g, "");
  if (nodeEnv !== "production") {
    return "dev-admin-only-change-me-in-production";
  }
  return "";
};
