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
});
