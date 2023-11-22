import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
	readonly id: number;

	readonly oauthId: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	readonly username: string;

	@IsString()
	@IsNotEmpty()
	readonly fullname: string;

	@IsString()
	@IsNotEmpty()
	@IsEmail()
	readonly email: string;

	readonly avatar: string;

	readonly provider: string;

	readonly twoFactor: boolean;

	readonly status: string;

	readonly wins: number;

	readonly losses: number;

	// readonly friends: string[];

	// readonly friendOf: string[];

	// readonly matches: string[];

	readonly createdAt: Date;

	readonly updatedAt: Date;
}
