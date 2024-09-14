import { FastifyInstance } from 'fastify';
import { knex } from '../config';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUsersBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    });

    const { name, email, password } = createUsersBodySchema.parse(request.body);

    const emailExists = await knex('users').where('email', email).first();
    if (emailExists) return reply.status(409).send({ message: 'Email already exists.' });

    let sessionUuid = request.cookies.sessionUuid;

    if (!sessionUuid) {
      sessionUuid = randomUUID();

      reply.cookie('sessionUuid', sessionUuid, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [createdUser] = await knex('users')
      .insert({
        uuid: randomUUID(),
        name,
        email,
        password: hashedPassword,
        session_uuid: sessionUuid,
      })
      .returning('*');

    return reply.status(201).send(createdUser);
  });

  app.post('/login', async (request, reply) => {
    const createUsersBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    });

    const { email, password } = createUsersBodySchema.parse(request.body);

    const user = await knex('users').where('email', email).first();
    if (!user) return reply.status(404).send({ message: 'User not found.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return reply.status(401).send({ message: 'Invalid password.' });

    return reply.status(200).send({ session_uuid: user.session_uuid });
  });
}
