import { Client } from "pg";

async function query(queryObject) {
    const client = new Client({
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        ssl: process.env.NODE_ENV === "production" ? true : false,
    });
    try {
        await client.connect();
        const result = await client.query(queryObject);
        return result;
    } catch (error) {
        throw new Error("Error querying database", { cause: error });
    } finally {
        await client.end();
    }
}
export default {
    query: query,
};
