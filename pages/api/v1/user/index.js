import controller from "infra/controller";
import session from "models/session";
import user from "models/user";
import { createRouter } from "next-connect";

const router = createRouter();
router.get(getHandler);

export default router.handler(controller.errorHandlers);
async function getHandler(request, response) {
  const sessionToken = request.cookies.session_id;
  const sessionObject = await session.findOneValidByToken(sessionToken);
  console.log(sessionObject.user_id);
  const userFound = await user.findOneById(sessionObject.user_id);
  return response.status(200).json(userFound);
}
