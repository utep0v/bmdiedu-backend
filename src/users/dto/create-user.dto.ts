export class CreateUserDto {
  name: string;
  email: string;
  role?: string;
  activationToken?: string;
  resetToken?: string;
}
