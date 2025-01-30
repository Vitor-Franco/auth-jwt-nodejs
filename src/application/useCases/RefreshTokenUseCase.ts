import { prismaClient } from "../libs/prismaClient";
import { type JwtPayload, sign, verify } from "jsonwebtoken";
import { env } from "../config/env";
import { InvalidToken } from "../errors/InvalidToken";
import { JWT } from "../constants/jwt";

type IInput = {
	refreshToken: string;
};

interface IOutput {
	accessToken: string;
	refreshToken: string;
}

export class RefreshTokenUseCase {
	async execute({ refreshToken }: IInput): Promise<IOutput> {
		let refreshTokenPayload: JwtPayload;

		try {
			refreshTokenPayload = verify(
				refreshToken,
				env.refreshTokenSecret,
			) as JwtPayload;
		} catch {
			throw new InvalidToken();
		}

		const accountId = refreshTokenPayload.sub;
		const refreshTokenExists = await prismaClient.refreshToken.findFirst({
			where: {
				token: refreshToken,
			},
		});

		if (!refreshTokenExists) {
			// This account can be invaded - someone are trying to use an old token.
			await prismaClient.refreshToken.deleteMany({
				where: {
					accountId,
				},
			});
			throw new InvalidToken();
		}

		const account = await prismaClient.account.findUnique({
			where: {
				id: accountId,
			},
		});

		if (!account) {
			throw new InvalidToken();
		}

		const accessToken = sign(
			{ sub: accountId, role: account.roleId },
			env.jwtSecret,
			{ expiresIn: JWT.access_token.expires_in },
		);

		const newRefreshToken = sign({ sub: accountId }, env.refreshTokenSecret, {
			expiresIn: JWT.refresh_token.expires_in,
		});

		await Promise.all([
			prismaClient.refreshToken.create({
				data: {
					token: newRefreshToken,
					accountId: account.id,
				},
			}),
			prismaClient.refreshToken.deleteMany({
				where: {
					token: refreshToken,
				},
			}),
		]);

		return {
			accessToken,
			refreshToken: newRefreshToken,
		};
	}
}
