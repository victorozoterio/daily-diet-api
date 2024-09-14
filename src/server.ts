import fastify from 'fastify';
import cookie from '@fastify/cookie';
import { env } from './config';
import { usersRoutes } from './routes/users';
import { mealsRoutes } from './routes/meals';

const app = fastify();

app.register(cookie);
app.register(usersRoutes, { prefix: 'users' });
app.register(mealsRoutes, { prefix: 'meals' });

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server is running on port ${env.PORT}`);
});
