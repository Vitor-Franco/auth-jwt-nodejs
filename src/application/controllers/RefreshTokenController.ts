import { z } from "zod";
import type { IController, IResponse } from "../interface/IController";
import { InvalidCredentials } from "../errors/InvalidCredentials";
import type { IRequest } from "../interface/IRequest";
import type { RefreshTokenUseCase } from "../useCases/RefreshTokenUseCase";
import { InvalidToken } from "../errors/InvalidToken";

const schema = z.object({
	token: z.string(),
});

export class RefreshTokenController implements IController {
	constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

	async handle(request: IRequest): Promise<IResponse> {
		try {
			const { token } = schema.parse(request.body);

			const { accessToken, refreshToken } =
				await this.refreshTokenUseCase.execute({
					refreshToken: token,
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

			if (error instanceof InvalidToken) {
				return {
					statusCode: 401,
					body: {
						error: "Invalid token",
					},
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
