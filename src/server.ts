import fastify from 'fastify';
import { knex } from './config';

const app = fastify();

app.get('/', async () => {
  const tables = await knex('sqlite_schema').select('*');
  return tables;
});

const port = Number(process.env.PORT);

app.listen({ port: port }).then(() => {
  console.log(`Server is running on port ${port}`);
});
