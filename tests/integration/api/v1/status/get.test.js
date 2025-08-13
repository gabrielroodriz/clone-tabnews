import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});
describe("GET to /api/v1/status", () => {
  let response;
  let responseBody;
  it("Retrieving current system status", async () => {
    response = await fetch("http://localhost:3000/api/v1/status");
    responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.updated_at).toBeDefined();
    expect(responseBody.dependencies.database.server_version).toBeDefined();
    expect(responseBody.dependencies.database.max_connections).toBeDefined();
    expect(
      responseBody.dependencies.database.current_connections,
    ).toBeDefined();
  });
});
