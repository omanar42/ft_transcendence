import { ApiProperty } from "@nestjs/swagger";
import { Friend, Match, Stats, Status } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsString, Max, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
	@ApiProperty()
	readonly oauthId: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(14)
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

export class UpdateUserDto {
	constructor(data : any) {
		this.id = 0;
		this.userId = "";
		this.friendId = data.oauthId;
		this.frUser = data.username;
		this.frAvatar = data.avatar;
		this.ftStatus = data.status;
		this.status = "";
		this.actions = [];
	}
	id : number;
	userId : string;
	friendId : string;
	frUser : string;
	frAvatar : string;
	ftStatus : string;
	status : string;
	actions : string[];
  }