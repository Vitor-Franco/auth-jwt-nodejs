import { AuthorizationMiddleware } from "../application/middlewares/authorizationMiddleware";


export function makeAuthorizationMiddleware(allowedRoles: string[]) {
  return new AuthorizationMiddleware(allowedRoles);
}
