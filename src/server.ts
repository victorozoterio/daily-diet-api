import fastify from 'fastify';
import { env, knex } from './config';

const app = fastify();

app.get('/', async () => {
  const tables = await knex('sqlite_schema').select('*');
  return tables;
});

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server is running on port ${env.PORT}`);
});
