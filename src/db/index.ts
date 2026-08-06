import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.ts';

const { Pool } = pg;

let dbInstance: any = null;

export const getDb = () => {
  if (dbInstance) return dbInstance;
  try {
    const pool = new Pool({
      host: process.env.SQL_HOST || 'localhost',
      user: process.env.SQL_USER || 'postgres',
      password: process.env.SQL_PASSWORD || '',
      database: process.env.SQL_DB_NAME || 'postgres',
      max: 10,
      connectionTimeoutMillis: 5000,
    });
    pool.on('error', (err) => {
      console.warn('Postgres pool background notice:', err.message);
    });
    dbInstance = drizzle(pool, { schema });
    return dbInstance;
  } catch (err) {
    console.warn('Lazy database initialization skipped:', err);
    return null;
  }
};

