describe("POST to /api/v1/status", () => {
    let response;
    let responseBody;

    beforeEach(async () => {
        data = await fetch("http://localhost:3000/api/v1/status", {
            method: "POST",
        });
        response = data;
        responseBody = await data.json();
    });

    it("should return 200", () => {
        expect(response.status).toBe(200);
    });
});
