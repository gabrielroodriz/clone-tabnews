import { createRouter } from "next-connect";
import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import controller from "infra/controller";
const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

const defaultMigrationsOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(request, response) {
  const dbClient = await database.getNewClient();
  try {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
    });

    response.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(request, response) {
  const dbClient = await database.getNewClient();
  try {
    const migrateMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient: dbClient,
      dryRun: false,
    });

    const hasMigrations = migrateMigrations.length > 1;

    if (hasMigrations) {
      response.status(201).json(migrateMigrations);
    } else response.status(200).json(migrateMigrations);
  } finally {
    await dbClient.end();
  }
}
