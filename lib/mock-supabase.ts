export type MockAuthUser = {
  email: string;
  password: string;
  createdAt: string;
};

export type MockSession = {
  user: {
    email: string;
  };
  access_token: string;
};

const USERS_KEY = "moodifyr.mock.supabase.users";
const SESSION_KEY = "moodifyr.mock.supabase.session";

function isBrowser() {
  return typeof window !== "undefined";
}

function readUsers(): MockAuthUser[] {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(USERS_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as MockAuthUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: MockAuthUser[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function writeSession(session: MockSession | null) {
  if (!isBrowser()) {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function buildSession(email: string): MockSession {
  return {
    user: { email },
    access_token: `mock-token-${email}-${Date.now()}`,
  };
}

export async function signUpWithPassword(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  const existingUser = users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    return {
      data: { user: null, session: null },
      error: { message: "Uporabnik s tem e-poštnim naslovom že obstaja." },
    };
  }

  const nextUser: MockAuthUser = {
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  writeUsers([...users, nextUser]);

  const session = buildSession(normalizedEmail);
  writeSession(session);

  return {
    data: {
      user: { email: normalizedEmail },
      session,
    },
    error: null,
  };
}

export async function signInWithPassword(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  const existingUser = users.find((user) => user.email === normalizedEmail);

  if (!existingUser || existingUser.password !== password) {
    return {
      data: { user: null, session: null },
      error: { message: "Napačen e-poštni naslov ali geslo." },
    };
  }

  const session = buildSession(normalizedEmail);
  writeSession(session);

  return {
    data: {
      user: { email: normalizedEmail },
      session,
    },
    error: null,
  };
}

export async function getSession() {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as MockSession;
  } catch {
    return null;
  }
}

export async function signOut() {
  writeSession(null);
}
