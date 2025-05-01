import orchestrator from "tests/orchestrator";

beforeAll(async () => {
    await orchestrator.waitForAllServices();
});
describe("GET to /api/v1/status", () => {
    let response;
    let responseBody;
    it("Retrieving current system status", async () => {
        response = await fetch("http://localhost:3000/api/v1/migrations");
        responseBody = await response.json();

        expect(response.status).toBe(200);

        expect(Array.isArray(responseBody)).toBe(true);
    });
});
