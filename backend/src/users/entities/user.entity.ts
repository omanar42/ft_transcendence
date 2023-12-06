import { Friend, Match, Stats, Status, User } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserEntity implements User {
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
	readonly status: Status;

	@ApiProperty()
	readonly friends: Friend[];
	
	@ApiProperty()
	readonly stats: Stats[];
	
	@ApiProperty()
	readonly matches: Match[];

	@ApiProperty()
	readonly createdAt: Date;

	@ApiProperty()
	readonly updatedAt: Date;
}
