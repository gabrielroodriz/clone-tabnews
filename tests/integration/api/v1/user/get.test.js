import session from "models/session";
import setCookieParser from "set-cookie-parser";
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
      const { token, expires_at, updated_at } =
        await orchestrator.createSession(createdUser.id);

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

      // Session Renew assertions
      const renewedSessionObject = await session.findOneValidByToken(token);

      expect(renewedSessionObject.expires_at > expires_at).toBe(true);
      expect(renewedSessionObject.updated_at > updated_at).toBe(true);

      // Set-Cookie assertions

      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });
      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        httpOnly: true,
        path: "/",
      });
    });
    it("With nonexistent session", async () => {
      const nonexistentToken =
        "f9813f5cfcbc5423b19aeb7dcf8fecfb39bf4ddde6032a0415defe06e8601efc2a6ac07ef46c16473c99a211aa338131";

      const response = await fetch("http://localhost:3000/api/v1/user", {
        method: "GET",
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

      const response = await fetch("http://localhost:3000/api/v1/user", {
        method: "GET",
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
    it("Session with a few days of use", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - session.EXPIRATION_IN_MILLISECONDS / 2),
      });

      const createdUser = await orchestrator.createUser({
        username: "userwitdaysofusesession",
      });
      const { token, expires_at, updated_at } =
        await orchestrator.createSession(createdUser.id);

      jest.useRealTimers();

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
        username: "userwitdaysofusesession",
        password: createdUser.password,
        email: createdUser.email,
        created_at: createdUser.created_at.toISOString(),
        updated_at: createdUser.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      // Session Renew assertions
      const renewedSessionObject = await session.findOneValidByToken(token);

      expect(renewedSessionObject.expires_at > expires_at).toBe(true);
      expect(renewedSessionObject.updated_at > updated_at).toBe(true);

      // Set-Cookie assertions

      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });
      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        httpOnly: true,
        path: "/",
      });
    });
  });
});
