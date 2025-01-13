import database from "infra/database";

async function status(request, response) {
    const result = await database.query(
         "SELECT name, setting FROM pg_settings WHERE name IN ('server_version', 'max_connections')"
    );
    const databaseName = process.env.POSTGRES_DB
    const currentConnectionsResult = await database.query({
      text: "SELECT count(*)::int as current_connections FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName]
    });
    const updatedAt = new Date().toISOString();
    const serverVersion = result.rows.find(
        (row) => row.name === "server_version"
    ).setting.toString();
    const maxConnections = result.rows.find(
        (row) => row.name === "max_connections"
    ).setting;

    const currentConnections =
        currentConnectionsResult.rows[0].current_connections;


    response.status(200).json({
        updated_at: updatedAt,
        dependencies: {
            database: {
                server_version: serverVersion,
                max_connections: parseInt(maxConnections),
                current_connections: currentConnections,
            },
        },
    });
}
export default status;
