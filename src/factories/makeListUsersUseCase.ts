import { ListUsersUseCase } from "../application/useCases/ListUsersUseCase";



export function makeListUsersUseCase() {
  return new ListUsersUseCase();
}
