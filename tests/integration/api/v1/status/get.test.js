describe("GET to /api/v1/migrations should to return 200", () => {
    let response;
    let responseBody;

    beforeEach(async () => {
        data = await fetch("http://localhost:3000/api/v1/migrations");
        response = data;
        responseBody = await data.json();
    });

    it("should return 200", () => {
        expect(response.status).toBe(200);
    });

    it("should responseBody return an array", () => {
        console.log(responseBody);
        expect(Array.isArray(responseBody)).toBe(true);
    });
});
