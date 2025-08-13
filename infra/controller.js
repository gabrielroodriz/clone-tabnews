import { InternalServerError, MethodNotAllowedError } from "infra/errors";

function onErroHandler(error, request, response) {
  const fallbackError = new InternalServerError({
    cause: error,
    statusCode: error.statusCode
  });

  response.status(fallbackError.statusCode).json(fallbackError);
}

function onNoMatchHandler(request, response) {
  const publicErroObjet = new MethodNotAllowedError();
  response.status(publicErroObjet.statusCode).json(publicErroObjet);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErroHandler,
  }
}
export default controller;