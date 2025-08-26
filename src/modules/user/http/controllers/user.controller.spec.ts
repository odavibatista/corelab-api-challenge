import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import {
  INestApplication,
} from '@nestjs/common';
import { PrismaProvider } from '../../../../shared/infra/providers/Prisma.provider';
import { AppModule } from '../../../../app/app.module';
import { UserModule } from '../../infra/modules/user.module';
import { SharedModule } from '../../../../shared/infra/modules/Shared.module';
import { Environment } from '../../../../shared/config/app.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { faker } from '@faker-js/faker';
import { CreateUserBodyDTO } from '../../domain/dtos/requests/CreateUser.request.dto';

describe('User Controller - /user', () => {
  const controllerRoute = '/user';
  const registerUserRoute = `${controllerRoute}/register`;
  const loginUserRoute = `${controllerRoute}/login`;

  let controller: UserController;

  let app: INestApplication;
  let prisma: PrismaProvider;
  let jwtToken: string;

  const password = 'SenhaValida@1234$';

  let data: CreateUserBodyDTO;

  let mockdata = {
    id_user: faker.string.uuid(),
    name: 'Fulano de Tal',
    email: faker.internet.email(),
    password: password,
  };

  data = mockdata;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UserModule, SharedModule],
      providers: [PrismaProvider],
    })
      .overrideProvider(PrismaProvider)
      .useValue(new PrismaProvider(Environment.TEST))
      .compile();

    prisma = moduleRef.get(PrismaProvider);

    app = moduleRef.createNestApplication<NestExpressApplication>();
    app.useGlobalFilters();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.seed([
      // Add your seed data here
    ]);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await prisma.clear('all');
  });

  describe('POST /register', () => {
    describe('\nSuccessful cases:', () => {

    });
    describe('\nUnsuccessful cases:', () => {
    });
  });

  describe('POST /login', () => {
    describe('\nSuccessful cases:', () => {

    });

    describe('\nUnsuccessful cases:', () => {

    });
  });
});
