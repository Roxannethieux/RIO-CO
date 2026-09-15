import { Pool, types } from "pg";

// Par défaut, node-postgres convertit les colonnes DATE en objets Date JS
// (recalés sur le fuseau du serveur), ce qui casse toute comparaison ou
// affichage basé sur la chaîne "YYYY-MM-DD" utilisée partout dans ce projet.
// On force ici le type OID 1082 (date) à rester une chaîne brute.
types.setTypeParser(1082, (value: string) => value);

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

export function isDbConfigured() {
  return Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL);
}

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("Aucune base de données configurée (POSTGRES_URL manquant).");
    }
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
    });
  }
  return pool;
}

async function ensureSchema() {
  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      address TEXT NOT NULL,
      project_type TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      appointment_date DATE NOT NULL,
      start_minutes INTEGER NOT NULL,
      end_minutes INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await db.query(
    `CREATE INDEX IF NOT EXISTS appointments_date_idx ON appointments (appointment_date);`
  );
}

/** Garantit que le schéma existe, une seule fois par instance de fonction serverless. */
export async function withDb<T>(fn: (db: Pool) => Promise<T>): Promise<T> {
  const db = getPool();
  if (!schemaReady) {
    schemaReady = ensureSchema();
  }
  await schemaReady;
  return fn(db);
}
