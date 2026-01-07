import database from "infra/database";
import password from "models/password";
import { ValidationError, NotFoundError } from "infra/errors.js";


async function create(input) {
  await validateUniqueEmail(input.email);
  await validateUniqueUsername(input.username);
  await hashPasswordInObject(input);

  const newUser = await runInsertQuery(input);
  return newUser;

  async function validateUniqueUsername(username) {
    const results = await database.query({
      text: `
        SELECT
          username
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        ;`,
      values: [username],
    });
    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "The username provided is already in use",
        action: "Please use another username to register",
      });
    }
  }

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: `
        SELECT
          email
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
        ;`,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "The email address provided is already in use",
        action: "Please use another email address to register",
      });
    }
  }

  async function hashPasswordInObject(input) {
    const hashedPassword = await password.hash(input.password);
    input.password = hashedPassword
  }

  async function runInsertQuery(input) {
    const results = await database.query({
      text: `
      INSERT INTO
      users (username, email, password)
      VALUES
      ($1, $2, $3)
      RETURNING
      *
      ;`,
      values: [input.username, input.email, input.password],
    });

    return results.rows[0];
  }
}

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);
  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        LIMIT
          1
        ;`,
      values: [username],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "The username you entered was not found in the system.",
        action: "Please verify that the username has been entered correctly.",
      });
    }
    return results.rows[0];
  }
}

const user = {
  create,
  findOneByUsername,
};

export default user;
