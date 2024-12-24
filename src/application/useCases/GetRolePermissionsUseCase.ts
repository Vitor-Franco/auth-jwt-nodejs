import { prismaClient } from "../libs/prismaClient";

interface IInput {
	roleId: string;
}

interface IOutput {
	permissionCode: string[];
}

export class GetRolePermissionsUseCase {
	async execute({ roleId }: IInput): Promise<IOutput> {
		const rolePermissions = await prismaClient.rolePermission.findMany({
			where: {
				roleId,
			},
      select: {
        permissionCode: true,
      }
		});

    const codes = rolePermissions.map((rolePermission) => rolePermission.permissionCode);

    return {
      permissionCode: codes,
    };
	}
}
