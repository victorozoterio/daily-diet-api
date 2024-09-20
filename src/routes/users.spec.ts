import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { execSync } from 'node:child_process';

describe('Users routes', () => {
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

  describe('create', () => {
    it('should be able to create a user', async () => {
      await request(app.server)
        .post('/users')
        .send({
          name: 'test',
          email: 'test@gmail.com',
          password: 'test@123',
        })
        .expect(201);
    });

    it('should return 409 if user already exists', async () => {
      await request(app.server)
        .post('/users')
        .send({
          name: 'test',
          email: 'test@gmail.com',
          password: 'test@123',
        })
        .expect(201);

      await request(app.server)
        .post('/users')
        .send({
          name: 'test',
          email: 'test@gmail.com',
          password: 'test@123',
        })
        .expect(409);
    });
  });

  describe('login', () => {
    it('should be able login a user', async () => {
      await request(app.server)
        .post('/users')
        .send({
          name: 'test',
          email: 'test@gmail.com',
          password: 'test@123',
        })
        .expect(201);

      await request(app.server)
        .post('/users/login')
        .send({
          email: 'test@gmail.com',
          password: 'test@123',
        })
        .expect(200);
    });

    it('should return 404 if user does not exist', async () => {
      await request(app.server)
        .post('/users/login')
        .send({
          email: 'nonexistent@gmail.com',
          password: 'test@123',
        })
        .expect(404);
    });

    it('should return 401 if password is invalid', async () => {
      await request(app.server)
        .post('/users')
        .send({
          name: 'test',
          email: 'test@gmail.com',
          password: 'test@123',
        })
        .expect(201);

      await request(app.server)
        .post('/users/login')
        .send({
          email: 'test@gmail.com',
          password: 'wrongpassword@123',
        })
        .expect(401);
    });
  });
});
