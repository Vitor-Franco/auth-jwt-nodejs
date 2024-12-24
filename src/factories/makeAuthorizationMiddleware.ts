import { AuthorizationMiddleware } from "../application/middlewares/AuthorizationMiddleware";
import { makeGetRolePermissionsUseCase } from "./makeGetRolePermissionsUseCase";


export function makeAuthorizationMiddleware(allowedRoles: string[]) {
  const rolePermissionsUseCase = makeGetRolePermissionsUseCase();

  return new AuthorizationMiddleware(allowedRoles, rolePermissionsUseCase);
}
