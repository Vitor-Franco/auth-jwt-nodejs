import { verify } from "jsonwebtoken";
import type {
	IData,
	IMiddleware,
	IRequest,
	IResponse,
} from "../interface/IMiddleware";
import { env } from "../config/env";

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

			const payload = verify(token, env.jwtSecret);

			return {
				data: {
          accountId: payload.sub,
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
