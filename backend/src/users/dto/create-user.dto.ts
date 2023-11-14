import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
	@ApiProperty()
	readonly id: number;

	@ApiProperty()
	readonly oauthId: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@ApiProperty()
	readonly username: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@ApiProperty()
	readonly password: string;

	@ApiProperty()
	readonly avatar: string;

	@ApiProperty()
	readonly twoFactor: boolean;

	@ApiProperty()
	readonly status: string;

	@ApiProperty()
	readonly wins: number;

	@ApiProperty()
	readonly losses: number;

	@ApiProperty()
	readonly friends: string[];

	@ApiProperty()
	readonly friendOf: string[];

	@ApiProperty()
	readonly matches: string[];

	@ApiProperty()
	readonly createdAt: Date;

	@ApiProperty()
	readonly updatedAt: Date;
}
