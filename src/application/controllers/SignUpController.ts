import { z } from "zod";
import type {
	IController,
	IRequest,
	IResponse,
} from "../interface/IController";
import type { SignUpUseCase } from "../useCases/SignUpUseCase";
import { AccountAlreadyExists } from "../errors/AccountAlreadyExists";

const schema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(8),
});

export class SignUpController implements IController {
	constructor(private readonly signUpUseCase: SignUpUseCase) {}

	async handle(request: IRequest): Promise<IResponse> {
    try {
			const { name, email, password } = schema.parse(request.body);

			await this.signUpUseCase.execute({
				name,
				email,
				password,
			});

			return {
				statusCode: 204,
				body: null,
			};
		} catch (error) {
			if (error instanceof z.ZodError) {
				return {
					statusCode: 400,
					body: error.issues,
				};
			}

      if (error instanceof AccountAlreadyExists) {
        return {
          statusCode: 409,
          body: {
            message: 'Account already exists',
          },
        }
      }

			throw error;
		}
	}
}