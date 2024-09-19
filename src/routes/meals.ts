import { FastifyInstance } from 'fastify';
import { knex } from '../config';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { checkSessionUuidExists } from '../middlewares/check-session-uuid-exists';
import { isValidDateAndTimeFormat } from '../utils';

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [checkSessionUuidExists] }, async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isWithinTheDiet: z.boolean(),
      dateAndTime: z.string().refine((date) => isValidDateAndTimeFormat(date), {
        message: 'Expected YYYY-MM-DD HH:MM:SS',
      }),
    });

    try {
      const { name, description, isWithinTheDiet, dateAndTime } = createMealsBodySchema.parse(
        request.body,
      );

      const { sessionUuid } = request.cookies;
      const user = await knex('users').where('session_uuid', sessionUuid).select('uuid').first();

      const [createdMeal] = await knex('meals')
        .insert({
          uuid: randomUUID(),
          name,
          description,
          is_within_the_diet: isWithinTheDiet,
          user_uuid: user?.uuid,
          date_and_time: dateAndTime,
        })
        .returning('*');

      return reply.status(201).send(createdMeal);
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
      dateAndTime: z
        .string()
        .optional()
        .refine((date) => !date || isValidDateAndTimeFormat(date), {
          message: 'Expected YYYY-MM-DD HH:MM:SS',
        }),
    });

    try {
      const { name, description, isWithinTheDiet, dateAndTime } = updateMealsBodySchema.parse(
        request.body,
      );

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
          date_and_time: dateAndTime ?? meal.date_and_time,
        })
        .returning('*');

      return reply.status(200).send(updatedMeal);
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

  app.delete('/:uuid', { preHandler: [checkSessionUuidExists] }, async (request, reply) => {
    const getMealsParamsSchema = z.object({ uuid: z.string().uuid() });
    const { uuid } = getMealsParamsSchema.parse(request.params);

    const { sessionUuid } = request.cookies;

    const user = await knex('users').where('session_uuid', sessionUuid).select('uuid').first();
    if (!user) return reply.status(404).send({ message: 'User does not exist.' });

    const meal = await knex('meals').where('user_uuid', user.uuid).andWhere('uuid', uuid).first();
    if (!meal) return reply.status(404).send({ message: 'Meal does not exist.' });

    await knex('meals').where('uuid', uuid).delete();

    return reply.status(204).send();
  });
}
