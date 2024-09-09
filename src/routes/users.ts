import { FastifyInstance } from 'fastify';
import { knex } from '../config';

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const tables = await knex('sqlite_schema').select('*');
    return tables;
  });
}
