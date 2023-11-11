import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
	@ApiProperty()
	readonly name?: string;
	
	@ApiProperty()
	readonly email: string;

	@ApiProperty()
	readonly username: string;

	@ApiProperty()
	readonly password: string;

	@ApiProperty()
	readonly level: number;

	@ApiProperty()
	readonly createdAt: Date;

	@ApiProperty()
	readonly updatedAt: Date;
}
