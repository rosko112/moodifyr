import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSql, isDatabaseConfigured } from "@/lib/neon";

const SESSION_COOKIE = "modifyr_session";

export type SessionUser = {
  id: number;
  email: string;
  username: string;
};

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");

  if (!salt || !key) {
    return false;
  }

  const hashedBuffer = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");

  if (hashedBuffer.length !== keyBuffer.length) {
    return false;
  }

  return timingSafeEqual(hashedBuffer, keyBuffer);
}

export async function ensureAuthTables() {
  if (!isDatabaseConfigured) {
    return;
  }

  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS username TEXT
  `;

  await sql`
    UPDATE users
    SET username = CONCAT('user_', id)
    WHERE username IS NULL OR btrim(username) = ''
  `;

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS users_username_key
    ON users (username)
  `;

  await sql`
    ALTER TABLE users
    ALTER COLUMN username SET NOT NULL
  `;
}

export async function createUser(
  email: string,
  username: string,
  password: string,
) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();
  const sql = getSql();

  const existingUsers = await sql`
    SELECT id
    FROM users
    WHERE email = ${normalizedEmail}
    LIMIT 1
  `;

  if (existingUsers.length > 0) {
    return { error: "A user with that email already exists." };
  }

  const existingUsernames = await sql`
    SELECT id
    FROM users
    WHERE username = ${normalizedUsername}
    LIMIT 1
  `;

  if (existingUsernames.length > 0) {
    return { error: "That username is already taken." };
  }

  const passwordHash = hashPassword(password);

  const insertedUsers = await sql`
    INSERT INTO users (email, username, password_hash)
    VALUES (${normalizedEmail}, ${normalizedUsername}, ${passwordHash})
    RETURNING id, email, username
  `;

  return {
    user: {
      id: Number(insertedUsers[0].id),
      email: insertedUsers[0].email,
      username: insertedUsers[0].username,
    },
    error: null,
  };
}

export async function authenticateUser(identifier: string, password: string) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const sql = getSql();

  const users = await sql`
    SELECT id, email, username, password_hash
    FROM users
    WHERE email = ${normalizedIdentifier}
      OR username = ${normalizedIdentifier}
    LIMIT 1
  `;

  const user = users[0];

  if (!user || !verifyPassword(password, user.password_hash)) {
    return {
      user: null,
      error: "Incorrect email, username, or password.",
    };
  }

  return {
    user: {
      id: Number(user.id),
      email: user.email,
      username: user.username,
    },
    error: null,
  };
}

export async function createSession(userId: number) {
  const sql = getSql();
  const token = randomBytes(32).toString("hex");

  await sql`
    INSERT INTO sessions (token, user_id)
    VALUES (${token}, ${userId})
  `;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token && isDatabaseConfigured) {
    const sql = getSql();

    await sql`
      DELETE FROM sessions
      WHERE token = ${token}
    `;
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentSessionUser() {
  if (!isDatabaseConfigured) {
    return null;
  }

  await ensureAuthTables();

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const sql = getSql();
  const users = await sql`
    SELECT users.id, users.email, users.username
    FROM sessions
    INNER JOIN users ON users.id = sessions.user_id
    WHERE sessions.token = ${token}
    LIMIT 1
  `;

  const user = users[0];

  if (!user) {
    return null;
  }

  return {
    id: Number(user.id),
    email: user.email,
    username: user.username,
  } satisfies SessionUser;
}

export async function requireSessionUser() {
  const user = await getCurrentSessionUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function redirectAuthenticatedUser() {
  const user = await getCurrentSessionUser();

  if (user) {
    redirect("/dashboard");
  }
}
