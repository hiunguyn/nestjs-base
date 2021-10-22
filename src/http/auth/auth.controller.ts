import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { Public, User } from '@/decorator'
import { AuthService } from '@/http/auth/auth.service'
import { AuthValidate } from '@/http/auth/auth.validate'
import { SignInDto, SignUpDto } from '@/http/auth/dto'
import { User as UserEntity } from '@/entities'

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly authValidate: AuthValidate) {}

  @Public()
  @HttpCode(200)
  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    await this.authValidate.signIn(signInDto)

    return this.authService.signIn(signInDto)
  }

  @HttpCode(200)
  @Get('/me')
  getMe(@User() user: UserEntity) {
    return user
  }

  @Public()
  @Post('/sign-up')
  @HttpCode(201)
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authValidate.signUp(signUpDto)
    await this.authService.signUp(signUpDto)
  }
}
