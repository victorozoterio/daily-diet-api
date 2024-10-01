import { FastifyInstance } from 'fastify';
import { knex } from '../config';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import { isStrongPassword } from '../utils/functions/is-strong-password';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUsersBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    });

    try {
      const { name, email, password } = createUsersBodySchema.parse(request.body);

      if (!isStrongPassword(password)) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: [
            'Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and special characters.',
          ],
        });
      }

      const emailExists = await knex('users').where('email', email).first();
      if (emailExists) return reply.status(409).send({ message: 'Email já existe.' });

      const sessionUuid = randomUUID();

      reply.cookie('sessionUuid', sessionUuid, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

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
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => {
          return `${err.path.join('.')} ${err.message}`;
        });

        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: formattedErrors,
        });
      }
    }
  });

  app.post('/login', async (request, reply) => {
    const loginBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    try {
      const { email, password } = loginBodySchema.parse(request.body);

      const user = await knex('users').where('email', email).first();
      if (!user) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'User not found.',
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid password.',
        });
      }

      return reply.status(200).send({ session_uuid: user.session_uuid });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => {
          return `${err.path.join('.')} ${err.message}`;
        });

        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: formattedErrors,
        });
      }
    }
  });
}
