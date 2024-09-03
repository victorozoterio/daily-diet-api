import { knex as setupKnex, Knex } from 'knex';
import 'dotenv/config';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL env not found.');

export const config: Knex.Config = {
  client: process.env.DATABASE_CLIENT,
  connection:
    process.env.DATABASE_CLIENT === 'sqlite'
      ? {
          filename: process.env.DATABASE_URL,
        }
      : process.env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './src/migrations',
  },
};

export const knex = setupKnex(config);
