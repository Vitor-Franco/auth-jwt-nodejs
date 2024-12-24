import { z } from "zod";
import type { IController, IResponse } from "../interface/IController";
import type { SignUpUseCase } from "../useCases/SignUpUseCase";
import { AccountAlreadyExists } from "../errors/AccountAlreadyExists";
import type { IRequest } from "../interface/IRequest";

const schema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(8),
  roleId: z.string().uuid(),
});

export class SignUpController implements IController {
	constructor(private readonly signUpUseCase: SignUpUseCase) {}

	async handle(request: IRequest): Promise<IResponse> {
		try {
			const { name, email, password, roleId } = schema.parse(request.body);

			await this.signUpUseCase.execute({
				name,
				email,
				password,
        roleId
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
						message: "Account already exists",
					},
				};
			}

			throw error;
		}
	}
}
