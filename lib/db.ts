import "server-only";
import { neon, type QueryResultRow } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL / POSTGRES_URL for database access.");
}

const sql = neon(connectionString);

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  return (await sql.query(text, params)) as T[];
}

export async function execute(text: string, params: unknown[] = []) {
  await sql.query(text, params);
}
