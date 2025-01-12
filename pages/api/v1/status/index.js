import database from "infra/database";

async function status(request, response) {
    const result = await database.query(
        "SELECT name, setting FROM pg_settings WHERE name IN ('server_version', 'max_connections')"
    );
    const currentConnectionsResult = await database.query(
        "SELECT count(*)::int as current_connections FROM pg_stat_activity"
    );

    const updatedAt = new Date().toISOString();
    const serverVersion = result.rows.find(row => row.name === "server_version").setting;
    const maxConnections = result.rows.find(row => row.name === "max_connections").setting;
    const currentConnections =
        currentConnectionsResult.rows[0].current_connections;
    console.log(result);
    response.status(200).json({
        updated_at: updatedAt,
        server_version: serverVersion,
        max_connections: maxConnections,
        current_connections: currentConnections,
    });
}
export default status;
