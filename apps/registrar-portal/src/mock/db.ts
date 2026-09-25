import { buildSeed } from "./seed";
import { todayLagos } from "./lib";

/**
 * Demo data store for the registrar portal. Lives in localStorage so edits
 * survive a reload, and reseeds itself each new day (every seed date is
 * relative to "today" in Lagos). Swap `src/mock/api.ts` for real HTTP calls
 * once the backend exposes these endpoints — the React Query hooks and pages
 * don't change.
 */

const KEY = "courtpulse_registrar_demo_db_v2";

// The store is intentionally loosely typed; api.ts shapes what leaves it.
export type MockDb = ReturnType<typeof buildSeed>;

let db: MockDb | null = null;

export function getDb(): MockDb {
  if (db && db.seeded_for === todayLagos()) return db;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.seeded_for === todayLagos()) {
        db = parsed;
        return db!;
      }
    }
  } catch {
    // Corrupt or unavailable storage — fall through to a fresh seed.
  }
  db = buildSeed();
  save();
  return db!;
}

export function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    // Storage full or blocked; the demo keeps working in memory.
  }
}

export function resetDb() {
  db = buildSeed();
  save();
}
