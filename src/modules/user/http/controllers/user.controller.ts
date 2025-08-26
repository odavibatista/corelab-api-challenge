import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { UserControllerInterface } from '../../domain/dtos/controllers/user.controller.dto';
import { AllExceptionsFilterDTO } from '../../../../shared/domain/dtos/errors/AllException.filter.dto';
import {
  CreateUserBodyDTO,
  CreateUserResponseDTO,
} from '../../domain/dtos/requests/CreateUser.request.dto';
import { Request, Response } from 'express';
import { EmailAlreadyRegisteredException } from '../../domain/dtos/errors/EmailAlreadyRegistered.exception';
import {
  UserLoginRequestDTO,
  UserLoginResponseDTO,
} from '../../domain/dtos/requests/UserLogin.request.dto';
import { InvalidCredentialsException } from '../../domain/dtos/errors/InvalidCredentials.exception';

@Controller('user')
@ApiTags('Usuário')
export class UserController implements UserControllerInterface {
  constructor(
  ) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'Usuário cadastrado com sucesso!',
    type: CreateUserResponseDTO,
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autorizado.',
    type: AllExceptionsFilterDTO,
  })
  @ApiConflictResponse({
    description: new EmailAlreadyRegisteredException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
    type: AllExceptionsFilterDTO,
  })
  async createUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createUserBody: CreateUserBodyDTO,
  ): Promise<any | Response | AllExceptionsFilterDTO> {
    if (req.user) {
      throw new UnauthorizedException('Usuário já autenticado.');
    }

  }

  @Post('login')
  @ApiOkResponse({
    description: 'Usuário logado com sucesso!',
    type: UserLoginResponseDTO,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Dados não processáveis.',
    type: AllExceptionsFilterDTO,
  })
  @ApiUnauthorizedResponse({
    description: new UnauthorizedException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiUnauthorizedResponse({
    description: new InvalidCredentialsException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
    type: AllExceptionsFilterDTO,
  })
  async login(
    @Body() data: UserLoginRequestDTO,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any | Response | AllExceptionsFilterDTO> {
    if (req.user) {
      throw new UnauthorizedException('Usuário já autenticado.');
    }
  }
}
