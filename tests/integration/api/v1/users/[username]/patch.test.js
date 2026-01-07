import password from "models/password";
import user from "models/user";
import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    it("With nonexistent `username`", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/undefinedUser",
        {
          method: "PATCH",
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "The username you entered was not found in the system.",
        action: "Please verify that the username has been entered correctly.",
        status_code: 404,
      });
    });
    it("With duplicate 'username'", async () => {
      const firstUser = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "firstuser",
          email: "firstuser@teste.com",
          password: "abs3213",
          created_at: "2025-09-17T17:25:53.159Z",
          updated_at: "2025-09-17T17:25:53.159Z",
        }),
      });

      expect(firstUser.status).toBe(201);

      const secondaryUser = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "secondaryuser",
          email: "secondaryuser@teste.com",
          password: "abs3213",
          created_at: "2025-09-17T17:25:53.159Z",
          updated_at: "2025-09-17T17:25:53.159Z",
        }),
      });

      expect(secondaryUser.status).toBe(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/secondaryuser",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "firstuser",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "The username provided is already in use",
        action: "Please use another username this operation",
        status_code: 400,
      });
    });
    it("With duplicate 'email'", async () => {
      const firstUser = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
          email: "user1@teste.com",
          password: "abs3213",
          created_at: "2025-09-17T17:25:53.159Z",
          updated_at: "2025-09-17T17:25:53.159Z",
        }),
      });

      expect(firstUser.status).toBe(201);

      const secondaryUser = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user2",
          email: "user2@teste.com",
          password: "abs3213",
          created_at: "2025-09-17T17:25:53.159Z",
          updated_at: "2025-09-17T17:25:53.159Z",
        }),
      });

      expect(secondaryUser.status).toBe(201);

      const response = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "user1@teste.com",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "The email address provided is already in use",
        action: "Please use another email address to register",
        status_code: 400,
      });
    });
    it("With unique 'username'", async () => {
      const user = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "unique",
          email: "unique@teste.com",
          password: "abs3213",
          created_at: "2025-09-17T17:25:53.159Z",
          updated_at: "2025-09-17T17:25:53.159Z",
        }),
      });

      expect(user.status).toBe(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/unique",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "gojo",
          }),
        },
      );

      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "gojo",
        email: "unique@teste.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });
    it("With unique 'email'", async () => {
      const user = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "unique",
          email: "uniqueEmail@teste.com",
          password: "abs3213",
          created_at: "2025-09-17T17:25:53.159Z",
          updated_at: "2025-09-17T17:25:53.159Z",
        }),
      });

      expect(user.status).toBe(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/unique",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "gojo@email.com",
          }),
        },
      );

      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "unique",
        email: "gojo@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });
    it("With new 'password'", async () => {
      const userPass = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "uniquePass",
          email: "newPass@teste.com",
          password: "abs3213",
          created_at: "2025-09-17T17:25:53.159Z",
          updated_at: "2025-09-17T17:25:53.159Z",
        }),
      });

      expect(userPass.status).toBe(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/uniquePass",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: "falabela",
          }),
        },
      );

      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniquePass",
        email: "newPass@teste.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);

      const userInDataBase = await user.findOneByUsername(
        responseBody.username,
      );
      const correctPasswordMatch = await password.compare(
        "falabela",
        userInDataBase.password,
      );
      expect(correctPasswordMatch).toBe(true);

      const incorrectPasswordMatch = await password.compare(
        "abs3213",
        userInDataBase.password,
      );
      expect(incorrectPasswordMatch).toBe(false);
    });
  });
});
