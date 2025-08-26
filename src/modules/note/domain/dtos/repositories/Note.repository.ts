import { Note } from '@prisma/client';
import {
  CreateNoteBodyDTO,
  CreateNoteResponseDTO,
} from '../requests/CreateNote.request.dto';
import { FindNoteByIdResponseDto } from '../requests/FindNote.request.dto';

export interface NoteRepositoryInterface {
  encryptedFields: (keyof Note)[];
  findById(id_user: string): Promise<FindNoteByIdResponseDto | null>;
  findByUser(id_user: string): Promise<FindNoteByIdResponseDto[]>;
  create(
    user_id: string,
    data: CreateNoteBodyDTO,
  ): Promise<CreateNoteResponseDTO>;
  delete(id_note: string): Promise<boolean>;
}
