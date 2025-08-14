
import { resolve } from "node:path";
import database from "infra/database";
import migrationRunner from "node-pg-migrate";

const defaultMigrationsOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};


async function listPendingMigrations() {
  const dbClient = await database.getNewClient();
  try {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
    });

    return pendingMigrations
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  const dbClient = await database.getNewClient();
  try {
    const migrateMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient: dbClient,
      dryRun: false,
    });

    return migrateMigrations
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations
}

export default migrator
