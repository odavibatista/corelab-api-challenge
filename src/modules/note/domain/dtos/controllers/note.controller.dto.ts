import { Request, Response } from 'express';
import { AllExceptionsFilterDTO } from '../../../../../shared/domain/dtos/errors/AllException.filter.dto';
import { CreateNoteBodyDTO } from '../requests/CreateNote.request.dto';

export interface NoteControllerInterface {
  findNoteById(
    noteId: string,
    req: Request,
    res: Response,
  ): Promise<Response | AllExceptionsFilterDTO>;
  createNote(
    req: Request,
    res: Response,
    createNoteBody: CreateNoteBodyDTO,
  ): Promise<Response | AllExceptionsFilterDTO>;
}
