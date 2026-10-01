import {
	IsEmail,
	IsOptional,
	IsString,
	MaxLength,
} from "class-validator";

export class UpdateUserDto {
	@IsEmail()
	@MaxLength(255)
	email!: string;

	@IsOptional()
	@IsString()
	@MaxLength(255)
	fullName?: string | null;
}