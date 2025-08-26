import { Inject } from '@nestjs/common';
import { UseCaseInterface } from '../../../../shared/domain/protocols/UseCase.protocol';
import { EncrypterProvider } from '../../../../shared/infra/providers/Encrypter.provider';
import { FindNoteByIdResponseDto } from '../../domain/dtos/requests/FindNote.request.dto';
import { NoteNotFoundException } from '../../domain/dtos/errors/NoteNotFoundException.exception';
import { NoteRepository } from '../db/repositories/note.repository';

export class FindNoteByIdUsecase implements UseCaseInterface {
  constructor(
    private encrypterProvider: EncrypterProvider,
    @Inject()
    private noteRepository: NoteRepository,
  ) {}

  async execute(
    cuid: string,
  ): Promise<FindNoteByIdResponseDto | NoteNotFoundException> {
    const note = await this.noteRepository.findById(cuid);

    if (!note) {
      throw new NoteNotFoundException();
    }

    return {
      id_note: note.id_note,
      note_title: note.note_title,
      note_color: note.note_color,
      note_text: note.note_text,
      starred: note.starred,
      user_id: note.user_id,
      created_at: note.created_at,
      updated_at: note.updated_at,
    } as FindNoteByIdResponseDto;
  }
}
