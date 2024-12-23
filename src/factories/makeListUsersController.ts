import { ListUsersController } from "../application/controllers/ListUsersController";
import { makeListUsersUseCase } from "./makeListUsersUseCase";


export function makeListUsersController() {
  return new ListUsersController(makeListUsersUseCase())
}
