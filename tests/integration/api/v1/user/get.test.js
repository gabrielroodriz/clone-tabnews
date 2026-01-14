import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});
describe("GET /api/v1/user", () => {
  describe("Default user", () => {
    it("With valid session", async () => {
      const createdUser = await orchestrator.createUser({
        username: "userwithvalidsession",
      });
      const { token } = await orchestrator.createSession(createdUser.id);

      const response = await fetch("http://localhost:3000/api/v1/user", {
        method: "GET",
        headers: {
          Cookie: `session_id=${token}`,
        },
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: createdUser.id,
        username: "userwithvalidsession",
        password: createdUser.password,
        email: createdUser.email,
        created_at: createdUser.created_at.toISOString(),
        updated_at: createdUser.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
  });
});
