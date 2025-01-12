describe("GET to /api/v1/status", () => {
 let response;
 let responseBody;

  beforeEach(async () => {
  data = await fetch("http://localhost:3000/api/v1/status");
  response = data;
  responseBody = await data.json();
  console.log(responseBody);
});

  it("should return 200", () => {
    expect(response.status).toBe(200);
  });

  it("should return a date string", () => {
    const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
    expect(responseBody.updated_at).toBeDefined();
    expect(responseBody.updated_at).toEqual(parsedUpdatedAt)
  });

  it("should return a server version", () => {
    expect(responseBody.server_version).toBeDefined();
  });

  it("should return a max connections", () => {
    expect(responseBody.max_connections).toBeDefined();
  });

  it("should return a current connections", () => {
    expect(responseBody.current_connections).toBeDefined();
  });

});
