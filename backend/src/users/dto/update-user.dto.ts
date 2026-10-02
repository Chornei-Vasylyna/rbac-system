import {
	IsEmail,
	MaxLength,
} from "class-validator";

export class UpdateUserDto {
	@IsEmail()
	@MaxLength(255)
	email!: string;

}