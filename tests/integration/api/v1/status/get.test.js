import orchestrator from "tests/orchestrator";

beforeAll(async () => {
    await orchestrator.waitForAllServices();
});
describe("GET to /api/v1/migrations should to return 200", () => {
    let response;
    let responseBody;

    beforeEach(async () => {
        response = await fetch("http://localhost:3000/api/v1/migrations");
        responseBody = await response.json();
    });

    it("should return 200", () => {
        expect(response.status).toBe(200);
    });

    it("should responseBody return an array", () => {
        expect(Array.isArray(responseBody)).toBe(true);
    });
});
