import { FastifyInstance } from 'fastify';
import { knex } from '../config';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isWithinTheDiet: z.boolean(),
    });

    const { name, description, isWithinTheDiet } = createMealsBodySchema.parse(request.body);

    const sessionUuid = request.cookies.sessionUuid;
    const user = await knex('users').where('session_uuid', sessionUuid).select('uuid').first();

    const [createdMeal] = await knex('meals')
      .insert({
        uuid: randomUUID(),
        name,
        description,
        is_within_the_diet: isWithinTheDiet,
        user_uuid: user?.uuid,
      })
      .returning('*');

    return reply.status(201).send(createdMeal);
  });

  app.get('/', async (request, reply) => {
    const sessionUuid = request.cookies.sessionUuid;
    const user = await knex('users').where('session_uuid', sessionUuid).select('uuid').first();

    const mealsOfUser = await knex('meals').where('user_uuid', user?.uuid).select();

    return reply.status(200).send(mealsOfUser);
  });
}
