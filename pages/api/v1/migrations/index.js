import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationsOptions = {
    dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
    });

    response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migrateMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });

    const hasMigrations = migrateMigrations.length > 1;

    if (hasMigrations) {
      response.status(201).json(migrateMigrations);
    } else response.status(200).json(migrateMigrations);
  }

  await dbClient.end();
  return response.status(405).end();
}
