import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateRoleDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	name?: string;

	@IsOptional()
	@IsString()
	@MaxLength(500)
	description?: string;
}