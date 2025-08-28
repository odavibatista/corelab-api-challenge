import { Request, Response } from 'express';
import { AllExceptionsFilterDTO } from '../../../../../shared/domain/dtos/errors/AllException.filter.dto';
import { CreateNoteBodyDTO } from '../requests/CreateNote.request.dto';
import { EditNoteBodyDTO } from '../requests/EditNote.request.dto';

export interface NoteControllerInterface {
  browseNotes(
    req: Request,
    res: Response,
  ): Promise<Response | AllExceptionsFilterDTO>;
  findNoteById(
    cuid: string,
    req: Request,
    res: Response,
  ): Promise<Response | AllExceptionsFilterDTO>;
  createNote(
    req: Request,
    res: Response,
    createNoteBody: CreateNoteBodyDTO,
  ): Promise<Response | AllExceptionsFilterDTO>;
  editNote(
    cuid: string,
    req: Request,
    res: Response,
    body: EditNoteBodyDTO,
  ): Promise<Response | AllExceptionsFilterDTO>;
}
