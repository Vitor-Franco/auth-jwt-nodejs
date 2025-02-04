import { z } from "zod";
import type { IController, IResponse } from "../interface/IController";
import type { SignInUseCase } from "../useCases/SignInUseCase";
import { InvalidCredentials } from "../errors/InvalidCredentials";
import type { IRequest } from "../interface/IRequest";

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export class SignInController implements IController {
	constructor(private readonly signInUseCase: SignInUseCase) {}

	async handle(request: IRequest): Promise<IResponse> {
		try {
			const { email, password } = schema.parse(request.body);

			const { accessToken, refreshToken } = await this.signInUseCase.execute({
				email,
				password,
			});

			return {
				statusCode: 200,
				body: {
					accessToken,
          refreshToken,
				},
			};
		} catch (error) {
			if (error instanceof z.ZodError) {
				return {
					statusCode: 400,
					body: error.issues,
				};
			}

			if (error instanceof InvalidCredentials) {
				return {
					statusCode: 401,
					body: {
						error: "Invalid credentials",
					},
				};
			}

			throw error;
		}
	}
}
