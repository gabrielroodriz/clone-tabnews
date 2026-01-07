import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    it("With exact case match", async () => {
      const firstResponse = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "mesmocase",
          email: "mesmo.case@teste.com",
          password: "abs3213",
          created_at: "2025-09-17T17:25:53.159Z",
          updated_at: "2025-09-17T17:25:53.159Z",
        }),
      });

      expect(firstResponse.status).toBe(201);

      const secondyResponse = await fetch(
        "http://localhost:3000/api/v1/users/mesmocase",
      );

      expect(secondyResponse.status).toBe(200);

      const secondyResponseBody = await secondyResponse.json();
      expect(secondyResponseBody).toEqual({
        id: secondyResponseBody.id,
        username: "mesmocase",
        email: "mesmo.case@teste.com",
        password: secondyResponseBody.password,
        created_at: secondyResponseBody.created_at,
        updated_at: secondyResponseBody.updated_at,
      });

      expect(uuidVersion(secondyResponseBody.id)).toBe(4);
      expect(Date.parse(secondyResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(secondyResponseBody.updated_at)).not.toBeNaN();
    });
    it("With case mismatch", async () => {
      const firstResponse = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "caseDiferente",
          email: "diferent.case@teste.com",
          password: "abs3213",
          created_at: "2025-09-17T17:25:53.159Z",
          updated_at: "2025-09-17T17:25:53.159Z",
        }),
      });

      expect(firstResponse.status).toBe(201);

      const secondyResponse = await fetch(
        "http://localhost:3000/api/v1/users/caseDiferenTe",
      );

      expect(secondyResponse.status).toBe(200);

      const secondyResponseBody = await secondyResponse.json();
      expect(secondyResponseBody).toEqual({
        id: secondyResponseBody.id,
        username: "caseDiferente",
        email: "diferent.case@teste.com",
        password: secondyResponseBody.password,
        created_at: secondyResponseBody.created_at,
        updated_at: secondyResponseBody.updated_at,
      });

      expect(uuidVersion(secondyResponseBody.id)).toBe(4);
      expect(Date.parse(secondyResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(secondyResponseBody.updated_at)).not.toBeNaN();
    });
    it("With nonexistent username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/undefinedUser",
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      console.log(responseBody);
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "The username you entered was not found in the system.",
        action: "Please verify that the username has been entered correctly.",
        status_code: 404,
      });
    });
  });
});
