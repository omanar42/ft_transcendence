import { User } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class UserEntity implements User {
	@ApiProperty()
	id: number;

	@ApiProperty()
	oauthId: string;

	@ApiProperty()
	username: string;

	@ApiProperty()
	password: string;

	@ApiProperty()
	avatar: string;

	@ApiProperty()
	twoFactor: boolean;

	@ApiProperty()
	status: string;

	@ApiProperty()
	wins: number;

	@ApiProperty()
	losses: number;

	@ApiProperty()
	friends: string[];

	@ApiProperty()
	friendOf: string[];

	@ApiProperty()
	matches: string[];

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
