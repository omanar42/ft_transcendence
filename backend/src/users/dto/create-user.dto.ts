import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
	@ApiProperty()
	readonly oauthId: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@ApiProperty()
	readonly username: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	readonly fullname: string;

	@IsString()
	@IsNotEmpty()
	@IsEmail()
	@ApiProperty()
	readonly email: string;

	@ApiProperty()
	readonly avatar: string;

	@ApiProperty()
	readonly provider: string;

	@ApiProperty()
	readonly hashedRt: string;

	@ApiProperty()
	readonly twoFactor: boolean;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	readonly twoFaSec: string;

	@ApiProperty()
	readonly status: string;

	@ApiProperty()
	readonly level: number;

	@ApiProperty()
	readonly wins: number;

	@ApiProperty()
	readonly losses: number;

	// @ApiProperty({ required: false, nullable: true })
	// readonly friends: string[] | null;

	// @ApiProperty({ required: false, nullable: true })
	// readonly matches: string[] | null;

	@ApiProperty()
	readonly createdAt: Date;

	@ApiProperty()
	readonly updatedAt: Date;
}
