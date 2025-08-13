import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});
describe("POST to /api/v1/status", () => {
  let response;
  it("Retrieving current system status", async () => {
    response = await fetch("http://localhost:3000/api/v1/status", {
      method: "POST",
    });

    expect(response.status).toBe(405);

    const responseBody = await response.json();
    expect(responseBody).toEqual({
      name: "MethodNotAllowedError",
      message: "Método não permitido para este endpoint.",
      action: "Verifique se o método HTTP enviado é válido para este endpoint.",
      status_code: 405,
    });
  });
});
