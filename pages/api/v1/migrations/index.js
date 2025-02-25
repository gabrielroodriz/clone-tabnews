import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
    const dbClient = await database.getNewClient();
    const defaultMigrationsOptions = {
        dbClient,
        dryRun: true,
        dir: join("infra", "migrations"),
        direction: "up",
        verbose: true,
        migrationsTable: "pgmigrations",
    };
    if (request.method === "GET") {
        const pendingMigrations = await migrationRunner({
            ...defaultMigrationsOptions,
        });
        await dbClient.end();
        response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
        const migrateMigrations = await migrationRunner({
            ...defaultMigrationsOptions,
            dryRun: false,
        });

        await dbClient.end();
        const hasMigrations = migrateMigrations.length > 1;

        if (hasMigrations) {
            response.status(201).json(migrateMigrations);
        } else response.status(200).json(migrateMigrations);
    }

    return response.status(405).end();
}
