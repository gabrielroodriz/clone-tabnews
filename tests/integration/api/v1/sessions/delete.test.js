import session from "models/session";
import setCookieParser from "set-cookie-parser";
import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});
describe("DELETE /api/v1/sessions", () => {
  describe("Default user", () => {
    it("With nonexistent session", async () => {
      const nonexistentToken =
        "f9813f5cfcbc5423b19aeb7dcf8fecfb39bf4ddde6032a0415defe06e8601efc2a6ac07ef46c16473c99a211aa338131";

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: {
          cookie: `session_id=${nonexistentToken}`,
        },
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "User does not have an active session",
        action: "Please verify that this useris logged in and trye again",
        status_code: 401,
      });
    });
    it("With expired session", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - session.EXPIRATION_IN_MILLISECONDS),
      });

      const createdUser = await orchestrator.createUser({
        username: "userwithexpiredsession",
      });
      const { token } = await orchestrator.createSession(createdUser.id);

      jest.useRealTimers();

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${token}`,
        },
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "User does not have an active session",
        action: "Please verify that this useris logged in and trye again",
        status_code: 401,
      });
    });
    it("With valid session", async () => {
      const createdUser = await orchestrator.createUser({
        username: "userwithvalidsession",
      });
      const {
        token,
        expires_at,
        updated_at,
        user_id,
        id: session_id,
      } = await orchestrator.createSession(createdUser.id);

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${token}`,
        },
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: session_id,
        token,
        user_id,
        expires_at: responseBody.expires_at,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.expires_at < expires_at.toISOString()).toBe(true);
      expect(responseBody.updated_at > updated_at.toISOString()).toBe(true);

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });
      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: "invalid",
        maxAge: -1,
        httpOnly: true,
        path: "/",
      });
    });
  });
});
