import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

export const isDatabaseConfigured = Boolean(databaseUrl);

export function getSql() {
  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL in environment variables.");
  }

  return neon(databaseUrl);
}
