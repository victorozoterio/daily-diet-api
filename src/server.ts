import fastify from 'fastify';
import { env } from './config';
import { usersRoutes } from './routes/users';

const app = fastify();

app.register(usersRoutes);

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server is running on port ${env.PORT}`);
});
