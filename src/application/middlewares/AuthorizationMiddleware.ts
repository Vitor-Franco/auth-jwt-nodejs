import type { IData, IMiddleware, IResponse } from "../interface/IMiddleware";
import type { IRequest } from "../interface/IRequest";

export class AuthorizationMiddleware implements IMiddleware {
  constructor(private readonly allowedRoles: string[]) {}

	async handle({ account }: IRequest): Promise<IResponse | IData> {
		if (!account) {
			return {
				statusCode: 403,
				body: {
					message: "Access denied",
				},
			};
		}

    if (!this.allowedRoles.includes(account.role)) {
      return {
        statusCode: 403,
        body: {
          message: "Access denied",
        },
      };
    }

		return {
			data: {},
		};
	}
}
