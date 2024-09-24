import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { execSync } from 'node:child_process';

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest');
  });

  it('should be able to create a meal', async () => {
    const createUser = await request(app.server)
      .post('/users')
      .send({
        name: 'user',
        email: 'user@gmail.com',
        password: 'user@123',
      })
      .expect(201);

    const cookies = createUser.headers['set-cookie'];
    expect(cookies[0]).toContain('sessionUuid');

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Salada de fruta',
        description: 'mamão, aveia e banana',
        isWithinTheDiet: true,
        dateAndTime: '2024-09-20 16:00:00',
      })
      .expect(201);
  });

  it('should be able to list all meals', async () => {
    const createUser = await request(app.server)
      .post('/users')
      .send({
        name: 'user',
        email: 'user@gmail.com',
        password: 'user@123',
      })
      .expect(201);

    const cookies = createUser.headers['set-cookie'];
    expect(cookies[0]).toContain('sessionUuid');

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Salada de fruta',
        description: 'mamão, aveia e banana',
        isWithinTheDiet: true,
        dateAndTime: '2024-09-20 16:00:00',
      })
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'X-tudo',
        description: 'pão, hambuger, ovo e bacon',
        isWithinTheDiet: false,
        dateAndTime: '2024-09-20 21:00:00',
      })
      .expect(201);

    const response = await request(app.server).get('/meals').set('Cookie', cookies).expect(200);
    expect(response.body).toHaveLength(2);
  });

  it('should be able to get a specific meal', async () => {
    const createUser = await request(app.server)
      .post('/users')
      .send({
        name: 'user',
        email: 'user@gmail.com',
        password: 'user@123',
      })
      .expect(201);

    const cookies = createUser.headers['set-cookie'];
    expect(cookies[0]).toContain('sessionUuid');

    const createMeal = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Salada de fruta',
        description: 'mamão, aveia e banana',
        isWithinTheDiet: true,
        dateAndTime: '2024-09-20 16:00:00',
      })
      .expect(201);

    const mealUuid = createMeal.body.uuid;

    const response = await request(app.server)
      .get(`/meals/${mealUuid}`)
      .set('Cookie', cookies)
      .expect(200);

    expect(response.body).include({
      uuid: mealUuid,
      name: 'Salada de fruta',
      description: 'mamão, aveia e banana',
      is_within_the_diet: 1,
      date_and_time: '2024-09-20 16:00:00',
    });
  });
});
