import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AllExceptionsFilterDTO } from '../../../../shared/domain/dtos/errors/AllException.filter.dto';
import { Request, Response } from 'express';
import { UnprocessableDataException } from '../../../../shared/domain/errors/UnprocessableData.exception';
import { NoteControllerInterface } from '../../domain/dtos/controllers/note.controller.dto';
import {
  CreateNoteBodyDTO,
  CreateNoteResponseDTO,
} from '../../domain/dtos/requests/CreateNote.request.dto';
import { Cache } from '@nestjs/cache-manager';
import { NotAuthenticatedException } from '../../../../shared/domain/errors/NotAuthenticated.exception';
import {
  BrowseNotesResponseDto,
  FindNoteByIdResponseDto,
} from '../../domain/dtos/requests/FindNote.request.dto';
import { NoteNotFoundException } from '../../domain/dtos/errors/NoteNotFoundException.exception';
import { CreateNoteUsecase } from '../../infra/usecases/create-note.usecase';
import { FindNoteByIdUsecase } from '../../infra/usecases/find-note-by-id.usecase';
import { BrowseNotesUsecase } from '../../infra/usecases/browse-notes.usecase';

@Controller('notes')
@ApiTags('Anotações')
export class NoteController implements NoteControllerInterface {
  constructor(
    private readonly createNoteUseCase: CreateNoteUsecase,
    private readonly findNoteByIdUseCase: FindNoteByIdUsecase,
    private readonly browseNotesUseCase: BrowseNotesUsecase,
    @Inject('CACHE_MANAGER')
    private readonly cacheManager: Cache,
  ) {}

  @Get('browse')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: 'Anotações trazidas com sucesso.',
    type: BrowseNotesResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: new NotAuthenticatedException().message,
    type: AllExceptionsFilterDTO,
  })
  async browseNotes(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response | AllExceptionsFilterDTO> {
    if (!req.user) throw new NotAuthenticatedException();

    const cachedNotes = await this.cacheManager.get(
      `notes-${req.user.id_user}`,
    );

    if (cachedNotes) return res.status(200).json(cachedNotes);

    const result = await this.browseNotesUseCase.execute(req.user.id_user);

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      await this.cacheManager.set(`notes-${req.user.id_user}`, result);
      return res.status(200).json(result);
    }
  }

  @Get('find/:noteId')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: 'Anotação trazida com sucesso.',
    type: FindNoteByIdResponseDto,
  })
  @ApiNotFoundResponse({
    description: new NoteNotFoundException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiUnauthorizedResponse({
    description: new NotAuthenticatedException().message,
    type: AllExceptionsFilterDTO,
  })
  async findNoteById(
    @Param('noteId') noteId: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any | Response | AllExceptionsFilterDTO> {
    if (!req.user) throw new NotAuthenticatedException();

    const cachedNote = await this.cacheManager.get(`note-${noteId}`);

    if (cachedNote) return res.status(200).json(cachedNote);

    const result = await this.findNoteByIdUseCase.execute(noteId);

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      await this.cacheManager.set(`note-${noteId}`, result);
      return res.status(200).json(result);
    }
  }

  @Post('create')
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({
    description: 'Anotação salva com sucesso.',
    type: CreateNoteResponseDTO,
  })
  @ApiUnprocessableEntityResponse({
    description: new UnprocessableDataException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiUnauthorizedResponse({
    description: new NotAuthenticatedException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
    type: AllExceptionsFilterDTO,
  })
  async createNote(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createNoteBody: CreateNoteBodyDTO,
  ): Promise<any | Response | AllExceptionsFilterDTO> {
    if (!req.user) throw new NotAuthenticatedException();

    const result = await this.createNoteUseCase.execute(
      createNoteBody,
      req.user.id_user,
    );

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(201).json(result);
    }
  }
}
