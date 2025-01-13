describe("GET to /api/v1/status", () => {
 let response;
 let responseBody;

  beforeEach(async () => {
  data = await fetch("http://localhost:3000/api/v1/status");
  response = data;
  responseBody = await data.json();
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
    expect(responseBody.dependencies.database.server_version).toBeDefined();
    expect(responseBody.dependencies.database.server_version).toEqual("16.0");
  });

  it("should return a max connections", () => {
    expect(responseBody.dependencies.database.max_connections).toBeDefined();
    expect(responseBody.dependencies.database.max_connections).toEqual(100);
  });

  it("should return a current connections", () => {
    expect(responseBody.dependencies.database.current_connections).toBeDefined();
    expect(responseBody.dependencies.database.current_connections).toEqual(1);
  });

});
