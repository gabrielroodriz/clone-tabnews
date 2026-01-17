import { serialize } from "cookie";
import {
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "infra/errors";
import session from "models/session";

function onErroHandler(error, request, response) {
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError
  ) {
    return response.status(error.statusCode).json(error);
  }

  const fallbackError = new InternalServerError({
    cause: error,
  });
  console.log({ fallbackError });
  response.status(fallbackError.statusCode).json(fallbackError);
}

function onNoMatchHandler(request, response) {
  const publicErroObjet = new MethodNotAllowedError();
  response.status(publicErroObjet.statusCode).json(publicErroObjet);
}

async function setSessionCookie(sessionToken, response) {
  const cookie = serialize("session_id", sessionToken, {
    path: "/",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", cookie);
}
async function clearSessionCookie(response) {
  const cookie = serialize("session_id", "invalid", {
    path: "/",
    maxAge: -1,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", cookie);
}
const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErroHandler,
  },
  setSessionCookie,
  clearSessionCookie,
};
export default controller;
