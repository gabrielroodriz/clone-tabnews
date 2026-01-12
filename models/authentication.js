import { NotFoundError, UnauthorizedError } from "infra/errors";
import password from "models/password";
import user from "models/user";

async function findAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findUserByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);
    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Authentication data is incorrect",
        action: "Please verify that the submitted data is correct",
      });
    }
    throw error;
  }

  async function findUserByEmail(providedEmail) {
    try {
      const userFound = await user.findOneByEmail(providedEmail);

      return userFound;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Incorrect Email",
          action: "Please verify that the submitted data is correct",
        });
      }
      throw error;
    }
  }
  async function validatePassword(providedPassword, storedPassword) {
    const correctPasswordMatch = await password.compare(
      providedPassword,
      storedPassword,
    );

    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Incorrect Password",
        action: "Please verify that the submitted data is correct",
      });
    }
  }
}
const authentication = {
  findAuthenticatedUser,
};

export default authentication;
