import { hash } from "bcryptjs";
import { AccountAlreadyExists } from "../errors/AccountAlreadyExists";
import { prismaClient } from "../libs/prismaClient";

interface IInput {
	email: string;
	password: string;
	name: string;
}

export class SignUpUseCase {
	constructor(private readonly salt: number) {}

	async execute({ email, password, name }: IInput): Promise<void> {
		const accountAlreadyExists = await prismaClient.account.findUnique({
			where: {
				email,
			},
		});

		if (accountAlreadyExists) {
			throw new AccountAlreadyExists();
		}

		const hashedPassword = await hash(password, this.salt);

		await prismaClient.account.create({
			data: {
				email,
				name,
				password: hashedPassword,
				role: "USER",
			},
		});
	}
}
