import type { IData, IMiddleware, IResponse } from "../interface/IMiddleware";
import type { IRequest } from "../interface/IRequest";
import type { GetRolePermissionsUseCase } from "../useCases/GetRolePermissionsUseCase";

export class AuthorizationMiddleware implements IMiddleware {
	constructor(
		private readonly requiredPermissions: string[],
		private readonly getRolePermissionsUseCase: GetRolePermissionsUseCase,
	) {}

	async handle({ account }: IRequest): Promise<IResponse | IData> {
		if (!account) {
			return {
				statusCode: 403,
				body: {
					message: "Access denied",
				},
			};
		}

    const {
      permissionCode
    } = await this.getRolePermissionsUseCase.execute({
      roleId: account.role,
    });

    const isAllowed = this.requiredPermissions.some(rp => permissionCode.includes(rp));

		if (!isAllowed) {
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
