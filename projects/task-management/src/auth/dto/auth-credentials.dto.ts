import { IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class AuthCredentialsDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  username: string
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  // atleat one number/speacial char, no new line char, atleat one Uppercase and Lowercase
  @Matches(/((?=.*\d)|(?=.*\W+)).*$/, {
    message: 'Use atleat one number or speacial char',
  })
  @Matches(/(?![.\n]).*$/, {
    message: 'Invalid character',
  })
  @Matches(/(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Use atlest one uppercase and one lowercase letter',
  })
  password: string
}
