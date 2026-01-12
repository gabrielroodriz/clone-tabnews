import { serialize } from "cookie";
import controller from "infra/controller";
import authentication from "models/authentication";
import session from "models/session";
import { createRouter } from "next-connect";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const input = request.body;
  const authenticatedUser = await authentication.findAuthenticatedUser(
    input.email,
    input.password,
  );
  const newSession = await session.create(authenticatedUser.id);
  const cookie = serialize("session_id", newSession.token, {
    path: "/",
    expires: new Date(newSession.expires_at),
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
  response.setHeader("Set-Cookie", cookie);
  return response.status(201).json(newSession);
}
