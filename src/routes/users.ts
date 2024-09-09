import { FastifyInstance } from 'fastify';
import { knex } from '../config';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUsersBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    });

    const { name, email, password } = createUsersBodySchema.parse(request.body);

    const [createdUser] = await knex('users')
      .insert({
        uuid: randomUUID(),
        name,
        email,
        password,
      })
      .returning('*');

    return reply.status(201).send(createdUser);
  });
}
