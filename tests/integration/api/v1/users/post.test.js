import password from 'models/password';
import user from 'models/user';
import orchestrator from 'tests/orchestrator';
import { version as uuidVersion } from 'uuid';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe('POST /api/v1/users', () => {
  describe('Anonymous user', () => {
    it('With unique and validate data', async () => {
      const response = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: '67fb9789-dc41-4529-841b-ddbbf5485c03',
          username: 'gagosantos',
          email: 'gago@teste.com',
          password: 'abs3213',
          created_at: '2025-09-17T17:25:53.159Z',
          updated_at: '2025-09-17T17:25:53.159Z',
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: 'gagosantos',
        email: 'gago@teste.com',
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDataBase = await user.findOneByUsername(
        responseBody.username
      );
      const correctPasswordMatch = await password.compare(
        'abs3213',
        userInDataBase.password
      );
      expect(correctPasswordMatch).toBe(true);

      const incorrectPasswordMatch = await password.compare(
        'incorrectPassword',
        userInDataBase.password
      );
      expect(incorrectPasswordMatch).toBe(false);
    });
    it("With duplicate 'email'", async () => {
      const firstResponse = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'duplicatedemail',
          email: 'duplicad@teste.com',
          password: 'abs3213',
          created_at: '2025-09-17T17:25:53.159Z',
          updated_at: '2025-09-17T17:25:53.159Z',
        }),
      });

      expect(firstResponse.status).toBe(201);

      const secondyResponse = await fetch(
        'http://localhost:3000/api/v1/users',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'duplicatedemail2',
            email: 'duplicad@teste.com',
            password: 'abs3213',
            created_at: '2025-09-17T17:25:53.159Z',
            updated_at: '2025-09-17T17:25:53.159Z',
          }),
        }
      );

      expect(secondyResponse.status).toBe(400);

      const responseBody = await secondyResponse.json();
      expect(responseBody).toEqual({
        name: 'ValidationError',
        message: 'The email address provided is already in use',
        action: 'Please use another email address to register',
        status_code: 400,
      });
    });
    it("With duplicate 'username'", async () => {
      const firstResponse = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'duplicatedusername',
          email: 'usernameduplicated1@teste.com',
          password: 'abs3213',
          created_at: '2025-09-17T17:25:53.159Z',
          updated_at: '2025-09-17T17:25:53.159Z',
        }),
      });

      expect(firstResponse.status).toBe(201);

      const secondyResponse = await fetch(
        'http://localhost:3000/api/v1/users',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'DuplicatedUsername',
            email: 'usernameduplicated2@teste.com',
            password: 'abs3213',
            created_at: '2025-09-17T17:25:53.159Z',
            updated_at: '2025-09-17T17:25:53.159Z',
          }),
        }
      );

      expect(secondyResponse.status).toBe(400);

      const responseBody = await secondyResponse.json();
      expect(responseBody).toEqual({
        name: 'ValidationError',
        message: 'The username provided is already in use',
        action: 'Please use another username to register',
        status_code: 400,
      });
    });
  });
});
