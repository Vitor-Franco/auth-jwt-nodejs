import { compare } from "bcryptjs";
import { prismaClient } from "../libs/prismaClient";
import { InvalidCredentials } from "../errors/InvalidCredentials";
import { sign } from "jsonwebtoken";
import { env } from "../config/env";
import { JWT } from "../constants/jwt";

interface IInput {
	email: string;
	password: string;
}

interface IOutput {
	accessToken: string;
  refreshToken: string;
}

export class SignInUseCase {
	async execute({ email, password }: IInput): Promise<IOutput> {
		const account = await prismaClient.account.findUnique({
			where: {
				email,
			},
		});

		if (!account) {
			throw new InvalidCredentials();
		}

		const isPasswordValid = await compare(password, account.password);

		if (!isPasswordValid) {
			throw new InvalidCredentials();
		}

		const accessToken = sign(
			{ sub: account.id, role: account.roleId },
			env.jwtSecret,
			{ expiresIn: JWT.access_token.expires_in },
		);

    const refreshToken = sign(
      { sub: account.id },
      env.refreshTokenSecret,
      { expiresIn: JWT.refresh_token.expires_in },
    )

    await prismaClient.refreshToken.create({
      data: {
        token: refreshToken,
        accountId: account.id
      }
    })

		return {
			accessToken,
      refreshToken
		};
	}
}
