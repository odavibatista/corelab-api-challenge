import { HttpException } from '@nestjs/common';

export class UserNameAlreadyRegistered extends HttpException {
  constructor() {
    super('Este usuário já está associado a uma conta.', 403);
  }
}
