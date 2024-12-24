import { type JwtPayload, verify } from "jsonwebtoken";
import type { IData, IMiddleware, IResponse } from "../interface/IMiddleware";
import { env } from "../config/env";
import type { IRequest } from "../interface/IRequest";

export class AuthenticationMiddleware implements IMiddleware {
	async handle({ headers }: IRequest): Promise<IResponse | IData> {
		const { authorization } = headers;

		if (!authorization) {
			return {
				statusCode: 401,
				body: {
					error: "Invalid token",
				},
			};
		}

		try {
			const [bearer, token] = authorization.split(" ");

			if (bearer !== "Bearer" || !token) {
				throw new Error();
			}

			const payload = verify(token, env.jwtSecret) as JwtPayload;

			return {
				data: {
					account: {
						id: payload.sub,
						role: payload.role,
					},
				},
			};
		} catch {
			return {
				statusCode: 401,
				body: {
					error: "Invalid token",
				},
			};
		}
	}
}
