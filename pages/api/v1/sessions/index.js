import controller from 'infra/controller';
import authentication from 'models/authentication';
import { createRouter } from 'next-connect';
const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const input = request.body;
  const authenticatedUser = await authentication.findAuthenticatedUser(
    input.email,
    input.password
  );

  return response.status(201).json({
    username: authenticatedUser.username,
  });
}
