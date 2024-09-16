import { FastifyInstance } from 'fastify';
import { knex } from '../config';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { checkSessionUuidExists } from '../middlewares/check-session-uuid-exists';

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [checkSessionUuidExists] }, async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isWithinTheDiet: z.boolean(),
    });

    const { name, description, isWithinTheDiet } = createMealsBodySchema.parse(request.body);

    const { sessionUuid } = request.cookies;
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

  app.get('/', { preHandler: [checkSessionUuidExists] }, async (request, reply) => {
    const { sessionUuid } = request.cookies;
    const user = await knex('users').where('session_uuid', sessionUuid).select('uuid').first();

    const meals = await knex('meals').where('user_uuid', user?.uuid);

    return reply.status(200).send(meals);
  });

  app.get('/:uuid', { preHandler: [checkSessionUuidExists] }, async (request, reply) => {
    const getMealsParamsSchema = z.object({ uuid: z.string().uuid() });
    const { uuid } = getMealsParamsSchema.parse(request.params);

    const { sessionUuid } = request.cookies;

    const user = await knex('users').where('session_uuid', sessionUuid).select('uuid').first();
    if (!user) return reply.status(404).send({ message: 'User does not exist.' });

    const meal = await knex('meals').where('user_uuid', user.uuid).andWhere('uuid', uuid).first();
    if (!meal) return reply.status(404).send({ message: 'Meal does not exist.' });

    return reply.status(200).send(meal);
  });

  app.put('/:uuid', { preHandler: [checkSessionUuidExists] }, async (request, reply) => {
    const getMealsParamsSchema = z.object({ uuid: z.string().uuid() });
    const { uuid } = getMealsParamsSchema.parse(request.params);

    const updateMealsBodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      isWithinTheDiet: z.boolean().optional(),
    });

    const { name, description, isWithinTheDiet } = updateMealsBodySchema.parse(request.body);

    const { sessionUuid } = request.cookies;

    const user = await knex('users').where('session_uuid', sessionUuid).select('uuid').first();
    if (!user) return reply.status(404).send({ message: 'User does not exist.' });

    const meal = await knex('meals').where('user_uuid', user.uuid).andWhere('uuid', uuid).first();
    if (!meal) return reply.status(404).send({ message: 'Meal does not exist.' });

    const updatedMeal = await knex('meals')
      .where('uuid', uuid)
      .update({
        name: name ?? meal.name,
        description: description ?? meal.description,
        is_within_the_diet: isWithinTheDiet ?? meal.is_within_the_diet,
        updated_at: knex.fn.now(),
      })
      .returning('*');

    return reply.status(200).send(updatedMeal);
  });
}
