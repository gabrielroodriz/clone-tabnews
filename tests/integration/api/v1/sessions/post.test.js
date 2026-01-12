import orchestrator from 'tests/orchestrator.js';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});
describe('POST /api/v1/sessions', () => {
  describe('Anonymous user', () => {
    it('With incorrect `email` but correct `password`', async () => {
      await orchestrator.createUser({
        password: 'correct-password',
      });

      const response = await fetch('http://localhost:3000/api/v1/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'incorrect-email@testing.com',
          password: 'correct-password',
        }),
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        status_code: 401,
        name: 'UnauthorizedError',
        message: 'Authentication data is incorrect',
        action: 'Please verify that the submitted data is correct',
      });
    });
    it('With incorrect `password` but correct `email`', async () => {
      await orchestrator.createUser({
        email: 'correct-email@testing.com',
      });

      const response = await fetch('http://localhost:3000/api/v1/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'correct-email@testing.com',
          password: 'incorrect-password',
        }),
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        status_code: 401,
        name: 'UnauthorizedError',
        message: 'Authentication data is incorrect',
        action: 'Please verify that the submitted data is correct',
      });
    });
    it('With incorrect `email` and `password`', async () => {
      await orchestrator.createUser({});

      const response = await fetch('http://localhost:3000/api/v1/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'incorrect-email@testing.com',
          password: 'incorrect-password',
        }),
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        status_code: 401,
        name: 'UnauthorizedError',
        message: 'Authentication data is incorrect',
        action: 'Please verify that the submitted data is correct',
      });
    });
  });
});
