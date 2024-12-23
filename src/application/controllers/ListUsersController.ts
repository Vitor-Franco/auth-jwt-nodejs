import type {
  IController, IResponse
} from "../interface/IController";
import type { ListUsersUseCase } from "../useCases/ListUsersUseCase";

export class ListUsersController implements IController {
	constructor(private readonly listUsersUseCase: ListUsersUseCase) {}

	async handle(): Promise<IResponse> {
    const users = await this.listUsersUseCase.execute();

    return {
      statusCode: 200,
      body: {
        users
      },
    };
  }
}
