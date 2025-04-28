/* eslint-disable no-undef */
import { Client } from "pg";

const getSSL = () => process.env.NODE_ENV === "production";

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    throw new Error("Error querying database", { cause: error });
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: getSSL(),
  });
  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};
export default database;
