import { Pool, type QueryResultRow } from "pg";

declare global {
  var __moodfyrPool: Pool | undefined;
}

const connectionString =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL / POSTGRES_URL for database access.");
}

const isSslDisabled =
  process.env.POSTGRES_URL_NO_SSL === connectionString ||
  connectionString.includes("sslmode=disable");

const pool =
  global.__moodfyrPool ??
  new Pool({
    connectionString,
    ssl: isSslDisabled ? undefined : { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  global.__moodfyrPool = pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await pool.query<T>(text, params);
  return result.rows;
}

export async function execute(text: string, params: unknown[] = []) {
  await pool.query(text, params);
}
