import { prismaClient } from "../libs/prismaClient";


export class ListUsersUseCase {
  async execute() {
    return await prismaClient.account.findMany({
      select: {
        name: true,
        id: true,
      }
    });
  }
}
