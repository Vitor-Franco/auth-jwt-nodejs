import { AuthenticationMiddleware } from "../application/middlewares/authenticationMiddleware";

export function makeAuthenticationMiddleware() {
  return new AuthenticationMiddleware()
}
